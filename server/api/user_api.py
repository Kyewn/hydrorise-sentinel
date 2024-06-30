from flask import jsonify, Blueprint
from firebase import init_firebase

user_api = Blueprint('user_api', __name__)

# Firebase references
init_firebase()

@user_api.route("/users", methods=['GET'])
def get_user():
    return jsonify(
        {
            "users": [
                'vanerin',
                'uwu',
                'ryuuma'
            ]
        }
    )


@user_api.route("/users", methods=['POST'])
def create_user():
    print('create_user')


@user_api.route("/users", methods=['PUT'])
def update_user():
    print('update_user')


@user_api.route("/users", methods=['DELETE'])
def delete_user():
    print('delete_user')
