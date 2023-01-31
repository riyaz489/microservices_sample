import click
from flask.cli import with_appcontext

from app1 import User
from db import db

import logging

log = logging.getLogger(__name__)

@click.command(name='create_admin')
@click.option('-n','--username', default='admin', help='username')
@click.option('-p','--password', default='123', help='password')
# @click.option('-p','--password', prompt='Your password', hide_input=True, confirmation_prompt=True, help='The person to greet.')
@with_appcontext
def create(username, password):
    # below context manager is not required as flask already getting scoped session,
    # so connection will be closed once current function completes
    with db.session() as session:
        try:
            me = User(username, password)
            session.add(me)
            session.commit()
        except Exception as e:
            log.error(e)
            session.rollback()
