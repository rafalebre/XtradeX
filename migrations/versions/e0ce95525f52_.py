"""empty message

Revision ID: e0ce95525f52
Revises: b49edb08e88a
Create Date: 2023-07-26 19:05:39.262909

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e0ce95525f52'
down_revision = 'b49edb08e88a'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('service', schema=None) as batch_op:
        batch_op.drop_column('online')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('service', schema=None) as batch_op:
        batch_op.add_column(sa.Column('online', sa.BOOLEAN(), autoincrement=False, nullable=True))

    # ### end Alembic commands ###
