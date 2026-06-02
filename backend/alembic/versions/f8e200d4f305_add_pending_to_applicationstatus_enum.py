"""add pending to applicationstatus enum

Revision ID: f8e200d4f305
Revises: cd863a1879dc
Create Date: 2026-06-03 01:15:08.697908

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f8e200d4f305'
down_revision: Union[str, Sequence[str], None] = 'cd863a1879dc'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add PENDING to the applicationstatus enum and backfill stale APPLIED rows.

    Postgres requires `ALTER TYPE ... ADD VALUE` to run outside a transaction,
    which is what `autocommit_block` enables. The backfill afterwards runs in
    a normal transaction.
    """
    with op.get_context().autocommit_block():
        op.execute(
            "ALTER TYPE applicationstatus ADD VALUE IF NOT EXISTS 'PENDING'"
        )

    op.execute(
        "UPDATE applications SET status = 'PENDING' WHERE status = 'APPLIED'"
    )


def downgrade() -> None:
    """No-op.

    Postgres does not support removing values from an enum without recreating
    the type and rewriting every row that references it. Not worth the risk
    for a downgrade path that's never used in production.
    """
    pass
