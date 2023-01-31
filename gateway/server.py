import os, gridfs, pika, json
from flask import Flask, request, send_file
from flask_cors import CORS, cross_origin
from flask_pymongo import PyMongo
from unittest import mock

from flask_swagger_ui import get_swaggerui_blueprint

from global_objects import generator
from flask_swagger_generator.utils import SwaggerVersion
from werkzeug.exceptions import HTTPException
from flask_swagger_generator.generators import Generator

from app1.app1 import app1


DB_PASSWORD = os.getenv('DB_PASSWORD','secret')
DB_HOST = os.getenv('DB_HOST', 'localhost')
DB_USER = os.getenv('DB_USER','mongoadmin')
DB_PORT = os.getenv('DB_PORT',27017)
# DB_NAME = os.getenv('DB_NAME')
SWAGGER_URL = '/api/docs'
API_URL = '/swagger.json'
host = '0.0.0.0'
port = 8080


def create_server():
    server = Flask(__name__, static_url_path='/static', static_folder='static',)
    # adding cors for project
    # cors = CORS(server, resources={r"/api/*": {"origins": "*"}})
    # or we can put @cross_origin('*') over our view methods
    CORS(server, resources={r"/api": {"origins": "*"}})

    server.config.from_object(os.getenv('FLASK_CONFIG_ENV', 'config.StagingConfig'))  # os.environ['APP_SETTINGS'])
    mongo_video = PyMongo(server, uri=f'mongodb://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/videos?authSource=admin')
    mongo_mp3s = PyMongo(server, uri=f'mongodb://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/mp3s?authSource=admin')

    # mongo db can store files up to 16 mb only, so grid fs helps s to store large files in mongodb
    # behind the scenes gridfs store files in chunks into different documents.
    # also it uses 2 collection, one collection used to store file data and other is used to store metadata.
    fs = gridfs.GridFS(mongo_video.db)
    fs_mp3s = gridfs.GridFS(mongo_mp3s.db)

    # rabbitMQ connection
    # specify broker ip in below connection
    connection = pika.BlockingConnection(pika.ConnectionParameters("127.0.0.1",57910))#("rabbitmq"))
    # best practice is to have one log lived connection for an application and 1 channel per thread
    channel = connection.channel()

    # # to create a queue if not exists
    # channel.queue_declare(queue='video')

    # adding apps
    add_app(server, app1)

    # adding cli commands

    # add middleware

    # adding configs
    server.config['fs'] = fs
    server.config['fs_mp3s'] = fs_mp3s
    server.config['channel'] = channel
    server.config['swagger_generator'] = generator

    # generating swagger config
    generator.generate_swagger(server, destination_path='./static/swagger.json')

    # adding swagger app for swagger GUI; lib: flask-swagger-ui
    swaggerui_blueprint = get_swaggerui_blueprint(
        SWAGGER_URL,  # Swagger UI static files will be mapped to '{SWAGGER_URL}/dist/'
        server.static_url_path+API_URL,
        config={  # Swagger UI config overrides
            'app_name': "Gateway"
        },
        #
        # oauth_config={  # OAuth config. See https://github.com/swagger-api/swagger-ui#oauth2-configuration .
        #    'clientId': "your-client-id",
        #    'clientSecret': "your-client-secret-if-required",
        #    'realm': "your-realms",
        #    'appName': "your-app-name",
        #    'scopeSeparator': " ",
        #    'additionalQueryStringParams': {'test': "hello"}
        # }
    )
    server.register_blueprint(swaggerui_blueprint)
    return server


def add_app(server, app, prefix='/'):
    server.register_blueprint(app, url_prefix=prefix)


def add_cli_command(server, command):
    server.cli.add_command(command)


app = create_server()

# global error handlers
#
#
# @app.errorhandler(404)
# def handle_error(e):
#     code = 500
#     if isinstance(e, HTTPException):
#         code = e.code
#     return 'page not found', code
#
#
# @app.errorhandler(Exception)
# def handle_error(e):
#     code = 500
#     print(e)
#     if isinstance(e, HTTPException):
#         code = e.code
#     return 'test2', code


if __name__ == '__main__':

    app.run(host=host, port=port)
