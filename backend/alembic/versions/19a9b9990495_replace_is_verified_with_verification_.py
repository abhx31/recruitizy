"""replace is_verified with verification_status

Revision ID: 19a9b9990495
Revises: f8e200d4f305
Create Date: 2026-06-04 00:22:48.233212

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = '19a9b9990495'
down_revision: Union[str, Sequence[str], None] = 'f8e200d4f305'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema.

    Adds verification_status (new enum) and drops the old is_verified bool.
    Existing rows backfill to VERIFIED via server_default so test accounts
    aren't locked out. The default is then dropped so new signups fall back
    to the model's Python-level default (PENDING_EMAIL).

    The enum type is created explicitly (rather than relying on sa.Enum's
    implicit creation) because op.add_column doesn't reliably emit CREATE TYPE
    when the column type is a named enum.
    """
    verification_status_enum = postgresql.ENUM(
        'PENDING_EMAIL',
        'VERIFIED',
        name='verification_status_enum',
    )
    verification_status_enum.create(op.get_bind(), checkfirst=True)

    op.add_column(
        'users',
        sa.Column(
            'verification_status',
            verification_status_enum,
            nullable=False,
            server_default='VERIFIED',
        ),
    )
    op.alter_column('users', 'verification_status', server_default=None)
    op.drop_column('users', 'is_verified')


def downgrade() -> None:
    """Downgrade schema."""
    op.add_column(
        'users',
        sa.Column('is_verified', sa.BOOLEAN(), autoincrement=False, nullable=True),
    )
    op.drop_column('users', 'verification_status')
    op.execute('DROP TYPE verification_status_enum')
