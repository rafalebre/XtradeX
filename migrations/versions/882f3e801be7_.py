"""empty message

Revision ID: 882f3e801be7
Revises: dee640a7feb8
Create Date: 2023-07-31 22:46:36.700341

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '882f3e801be7'
down_revision = 'dee640a7feb8'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('wishlist', schema=None) as batch_op:
        batch_op.add_column(sa.Column('item', sa.String(), nullable=False))
        batch_op.drop_column('description')
        batch_op.drop_column('importance')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('wishlist', schema=None) as batch_op:
        batch_op.add_column(sa.Column('importance', sa.INTEGER(), autoincrement=False, nullable=False))
        batch_op.add_column(sa.Column('description', sa.VARCHAR(), autoincrement=False, nullable=False))
        batch_op.drop_column('item')

    # ### end Alembic commands ###
