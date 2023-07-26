"""empty message

Revision ID: 1cac217d2dda
Revises: e0ce95525f52
Create Date: 2023-07-26 19:15:58.194098

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '1cac217d2dda'
down_revision = 'e0ce95525f52'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('service', schema=None) as batch_op:
        batch_op.add_column(sa.Column('online', sa.Boolean(), nullable=False))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('service', schema=None) as batch_op:
        batch_op.drop_column('online')

    # ### end Alembic commands ###
