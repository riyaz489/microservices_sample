from datetime import datetime

from flask_migrate import Migrate
from sqlalchemy import Column, Integer, String
from db import db


class User(db.Model):
    __tablename__ = 'users'
    id = Column('user_id', Integer, primary_key=True)
    emails = Column(String(200), unique=True)
    password = Column(String(200))
    age = Column(Integer, nullable=True)

    def __init__(self, emails, password):
        self.emails = emails
        self.password = password

    def __repr__(self):
        return f'email: {self.email}'