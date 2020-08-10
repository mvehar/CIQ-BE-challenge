"""Sheets migration

Revision ID: f208a30638d7
Revises: 
Create Date: 2020-08-10 21:15:36.825405

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'f208a30638d7'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    op.create_table('sheets__sheets',
    sa.Column('id', sa.String(length=36), nullable=False),
    sa.Column('title', sa.Unicode(length=200), nullable=True),
    sa.Column('cells', sa.JSON(), nullable=True),
    sa.Column('date_created', sa.DateTime(), nullable=False),
    sa.Column('date_updated', sa.DateTime(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )


def downgrade():
    op.drop_table('sheets__sheets')
