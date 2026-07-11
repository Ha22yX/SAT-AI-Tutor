"""add password reset fields

Revision ID: 8fe3d8d3f5aa
Revises: 33b9f2f6fe1c
Create Date: 2025-12-07 14:00:00.000000

"""

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "8fe3d8d3f5aa"
down_revision = "33b9f2f6fe1c"
branch_labels = None
depends_on = None


def upgrade():
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    if "users" not in inspector.get_table_names():
        return

    columns = {col["name"] for col in inspector.get_columns("users")}
    new_columns = [
        ("password_reset_token", sa.String(length=255)),
        ("password_reset_requested_at", sa.DateTime(timezone=True)),
        ("password_reset_expires_at", sa.DateTime(timezone=True)),
    ]
    for name, column_type in new_columns:
        if name not in columns:
            op.add_column("users", sa.Column(name, column_type, nullable=True))


def downgrade():
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    if "users" not in inspector.get_table_names():
        return
    for name in [
        "password_reset_token",
        "password_reset_requested_at",
        "password_reset_expires_at",
    ]:
        columns = {col["name"] for col in inspector.get_columns("users")}
        if name in columns:
            with op.batch_alter_table("users") as batch_op:
                batch_op.drop_column(name)
