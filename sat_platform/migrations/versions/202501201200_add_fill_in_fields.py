"""add question_type and answer_schema for fill-in questions"""

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "202501201200_add_fill_in_fields"
down_revision = "7a3e9b2d1c45"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
        "questions",
        sa.Column(
            "question_type",
            sa.String(length=16),
            server_default="choice",
            nullable=False,
        ),
    )
    op.add_column("questions", sa.Column("answer_schema", sa.JSON(), nullable=True))


def downgrade():
    op.drop_column("questions", "answer_schema")
    op.drop_column("questions", "question_type")
