import jwt
from flask import Blueprint, request, url_for, redirect, flash
from app1.models import User
from flask import current_app
from utils import create_jwt
from flask_restful import Resource

# to pass daata from server file to api resource classes
#
# class ApiPage(Resource):
#     def __init__(self, bar):
#         self.bar = bar
#     def get(self):
#         serialized = str(my_bar)
#         return serialized
#
# my_bar = Bar()
# api.add_resource(ApiPage, '/api/my/end/point/',
#                  resource_class_kwargs={'bar': my_bar})

class Login(Resource):

    def post(self):
        auth = request.authorization
        if not auth:
            return "missing credentials", 401
        # for pagination
        # res = User.query.paginate(page=page, per_page=ROWS_PER_PAGE)

        res = User.query.filter_by(emails=auth.username).all()
        if len(res) > 0:
            user_row = res[0]
            email = user_row.emails
            # for simplicity passwords are not hashed
            password = user_row.password
            if auth.username != email or auth.password != password:
                return 'invalid creds', 401
            else:
                return create_jwt(auth.username, current_app.config['JWT_SECRET'], True)
        else:
            return 'user not found', 401


class Validate(Resource):

    def post(self):
        encode_jwt = request.headers["Authorization"]
        if not encode_jwt:
            return "missing creds", 401
        encode_jwt = encode_jwt.split(" ")[1]
        try:
            decoded = jwt.decode(
                encode_jwt, current_app.config['JWT_SECRET'], algorithms=["HS256"]
            )
        except:
            return "not authorized", 403
        return decoded, 200


# for refresh token logic create a similar token like access but its expiry wil be one day and payload will be less. so ogin api will return 2 tokens one is access and another one is refresh token.
# on refresh token request we will validate refresh token and provide new access token with old refresh token.