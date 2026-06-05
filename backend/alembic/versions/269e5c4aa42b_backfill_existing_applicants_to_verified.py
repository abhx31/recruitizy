"""backfill existing applicants to verified

Revision ID: 269e5c4aa42b
Revises: 19a9b9990495
Create Date: 2026-06-05 12:00:00.000000

We are now gating applicant routes behind email verification. Existing applicant
accounts predate the gate and were never sent a verification email, so flipping
the gate on without this backfill would lock them all out. New signups still
default to PENDING_EMAIL via the model and go through the verify flow normally.
"""
from typing import Sequence, Union

from alembic import op


revision: str = '269e5c4aa42b'
down_revision: Union[str, Sequence[str], None] = '19a9b9990495'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # NB: Postgres stores the enum *member name* (`Applicant`) not the value
    # (`applicant`), because SQLAlchemy's default Enum mapping uses .name.
    op.execute(
        """
        UPDATE users
        SET verification_status = 'VERIFIED'
        WHERE role = 'Applicant' AND verification_status = 'PENDING_EMAIL'
        """
    )


def downgrade() -> None:
    # Best-effort reversal. We can't distinguish between "was unverified before
    # the backfill" and "verified naturally after the backfill", so we leave
    # everyone verified rather than guess and lock real users out.
    pass
