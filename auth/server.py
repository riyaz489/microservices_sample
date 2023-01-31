import os

import click
from flask import Flask, jsonify, Blueprint
from flask.cli import with_appcontext
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from werkzeug.exceptions import HTTPException
from flask_restful import Api
from werkzeug.http import HTTP_STATUS_CODES

from app1.app1 import Validate, Login
from create_admin import create

from db import db, migrate
# in flask for request data conversion into specific datatype,
# we have marshal_with decorator
# and for request input validation we have reqparse

# #custom errors
# from werkzeug import exceptions
# class Error(exceptions.HTTPException):
#     code= 414
#     description = 'up'
#
# we can pass dict also while raising exception
# raise Error('yyyyy')


# custom api level error handler
class CustomApi(Api):
    def handle_error(self, err):
        print(err)  # log every exception raised in the application
        # Handle HTTPExceptions
        if isinstance(err, HTTPException):
            return jsonify({
                'message': getattr(
                    err, 'description', HTTP_STATUS_CODES.get(err.code, '')
                )
            }), err.code
        # If msg attribute is not set,
        # consider it as Python core exception and
        # hide sensitive error info from end user
        if not getattr(err, 'message', None):
            return jsonify({
                'message': 'Server has encountered some error'
            }), 500
        # Handle application specific custom exceptions
        return jsonify(**err.kwargs), err.http_status_code


# adding API blueprint
api_bp = Blueprint('api', __name__)
# core_bp = Blueprint('core', __name__)

api = CustomApi(api_bp)


def create_server():
    server = Flask(__name__)

    server.config.from_object(os.getenv('FLASK_CONFIG_ENV', 'config.StagingConfig'))  # os.environ['APP_SETTINGS'])
    server.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(server)
    migrate.init_app(server, db)




    # adding apps
    # api.add_resource(Validate, '/validate',endpoint=endpoint, resource_class_kwargs={'key': 'value'})
    api.add_resource(Validate, '/validate')
    api.add_resource(Login, '/login')

    # adding cli commands
    add_cli_command(server,create)

    # add middleware

    # registring api and core app blueprints
    server.register_blueprint(api_bp, url_prefix='/')
    return server





def add_cli_command(server, command):
    server.cli.add_command(command)



app = create_server()


# if you want to catch exceptions API resorces class levels, te create a class
# decorator and put it over API Resource classes like over Login class
#
# def handle_exec(method):
#     def wrapper(*args):
#         res = None
#         try:
#             res = method(*args)
#         except Exception as e:
#             print(e)
#         return res
#     return wrapper
#
#
# def for_all_methods(exclude, decorator):
#     def decorate(cls):
#         for attr in cls.__dict__:
#             if callable(getattr(cls, attr)) and attr not in exclude:
#                 setattr(cls, attr, decorator(getattr(cls, attr)))
#         return cls
#     return decorate
#
#
# @for_all_methods([],handle_exec)
# class A:
#     def b(self, f):
#         raise Error(f)
# a = A()



# hierarchy to catch exceptions will be class level-> api level-> blueprint-> server
# whoever catches it first will send response , so if class level cathes exception then it will handle it , otherwise
# it will go to api level and so one

# blueprint level error handler
@api_bp.app_errorhandler(404)
def handle_error(e):
    code = 500
    if isinstance(e, HTTPException):
        code = e.code
    return 'page not found', code

# global error handlers

# flask_restful.abort(401) # for 4xx errors,we can call this method to send response

# we can specify exceptiion type also instead of error code
@app.errorhandler(404)
def handle_error(e):
    code = 500
    if isinstance(e, HTTPException):
        code = e.code
    return 'page not found', code

# @app.errorhandler(Exception)
# def handle_error(e):
#     code = 500
#     print(e)
#     if isinstance(e, HTTPException):
#         code = e.code
#     return 'test2', code


if __name__ == '__main__':

    app.run(host='0.0.0.0', port=5000)
