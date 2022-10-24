"""Add when_expression column

Revision ID: 518c8438a91b
Revises: e0e3bb173ee6
Create Date: 2022-10-24 16:43:39.565871

"""
from alembic import op
import sqlalchemy as sa

from galaxy.model.custom_types import JSONType
from galaxy.model.migrations.util import (
    column_exists,
    drop_column,
)

# revision identifiers, used by Alembic.
revision = "518c8438a91b"
down_revision = "e0e3bb173ee6"
branch_labels = None
depends_on = None

# database object names used in this revision
table_name = "workflow_step"
column_name = "when_expression"


def upgrade():
    if not column_exists(table_name, column_name):
        op.add_column(table_name, sa.Column(column_name, JSONType))


def downgrade():
    drop_column(table_name, column_name)
