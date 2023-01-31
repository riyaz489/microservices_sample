import json

import flask
import pymongo
from bson import ObjectId
from flask_swagger_generator.generators import Generator
from flask_swagger_generator.utils import SecurityType
from gridfs import GridFS
from global_objects import generator
from storage import util
from auth_svc import access
from flask import Blueprint, request, current_app, send_file
from auth import validate

app1 = Blueprint('app1', __name__)
swagger_generator: Generator = generator
# blueprint/app level middlewares. for server level we can create separate middleware
# classes and register it to ap server.
# before_request() to execute an action before every request
# .after_request() to execute an action after every request


@swagger_generator.response(status_code=200, schema={'access_token': 'test'})
@swagger_generator.request_body({'username':'test', 'password': 'pass'})
@app1.route("/login", methods=["POST"])
def login():
    token, err = access.login(request)
    if not err:
        return token
    else:
        return err


@app1.route("/upload", methods=["POST"])
def upload():
    access, err = validate.token(request)
    access = json.loads(access)
    if access['admin']:
        if len(request.files)>1 or len(request.files)>1:
            return "exactly one file is required", 400

        for _, f in request.files.items():
            err = util.upload(f, current_app.config['fs'], current_app.config['channel'], access)
            if err:
                return err

        return "success!", 200
    else:
        return "not authorized", 401


@app1.route("/list", methods=["GET"])
def list_audios():
    args = request.args
    PAGE_NUMBER = args.get('page', 0)
    access, err = validate.token(request)
    access = json.loads(access)
    if access['admin']:

        fs:GridFS = current_app.config['fs']
        x = []
        PAGE_SIZE = 5
        z = fs.find().sort('uploadDate', pymongo.DESCENDING).skip(PAGE_SIZE*int(PAGE_NUMBER)).limit(PAGE_SIZE)

        # we cn use data class as model-view instead of creating dict below
        for y in z:
            x.append({'length': y.length, 'name': y.name, 'id': str(y._id), 'upload_time': y.upload_date, 'img_url':y._file.get('file_image_url', '')})

        return x, 200
    else:
        return "not authorized", 401


@swagger_generator.security(SecurityType.BEARER_AUTH)
@swagger_generator.response(status_code=200, schema={'file':'sample content'})
@swagger_generator.request_body({'fid': 'file id'})
@app1.route("/download", methods=["GET"])
def download():
    access, err = validate.token(request)

    access = json.loads(access)
    if access['admin']:
        fid = request.args.get('fid')
        if not fid:
            return 'fid is required', 400
        try:
            out = current_app.config['fs_mp3s'].get(ObjectId(fid))
            return send_file(out, download_name=f"{fid}.mp3")
        except Exception as err:
            print(err)
            return "internal sever error", 500
    return 'not authorized', 401
