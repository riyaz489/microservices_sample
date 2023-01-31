import os
basedir = os.path.abspath(os.path.dirname(__file__))


class Config(object):
    DEBUG = False
    TESTING = False
    CSRF_ENABLED = True
    JWT_SECRET = 'acsdfsdfsdgertyfgh45645'
    SECRET_KEY = 'this-really-needs-to-be-changed'
    DB_PASSWORD = os.getenv('DB_PASSWORD', 'test123')
    DB_HOST = os.getenv('DB_HOST', 'localhost')
    DB_USER = os.getenv('DB_USER','test')
    DB_PORT = os.getenv('DB_PORT','5432')
    DB_NAME = os.getenv('DB_NAME', 'auth')

    SQLALCHEMY_DATABASE_URI = f'postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}'


class ProductionConfig(Config):
    DEBUG = False


class StagingConfig(Config):
    DEVELOPMENT = True
    DEBUG = True


class DevelopmentConfig(Config):
    DEVELOPMENT = True
    DEBUG = True


class TestingConfig(Config):
    TESTING = True