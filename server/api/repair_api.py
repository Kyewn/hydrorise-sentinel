import json
from flask import Response, jsonify, Blueprint, request
from firebase import init_firebase
from firebase_admin import firestore
from google.cloud.firestore_v1.base_query import FieldFilter

from models.repair import Repair
from utils.response_utils import return_success, return_error

repair_api = Blueprint('repair_api', __name__)

# Firebase references
init_firebase()
db = firestore.client()
repairs_ref = db.collection('repairs')


@repair_api.route("/repairs", methods=['GET'])
def get_all_repairs():
    try:
        all_repairs = [(Repair.deserialize(doc)).serialize() for doc in repairs_ref.limit(50).get()]
        
        if all_repairs:
            return jsonify({"data": json.dumps(all_repairs)})
        else:
            return return_error('No repair data found.')
    except Exception as e:
        return return_error(f'An unexpected error occurred: {e}')


@repair_api.route("/repairs/<repair_id>", methods=['GET'])
def get_repair(repair_id):
    try:
        repair = repairs_ref.document(repair_id).get().to_dict()
        
        if repair:
            return jsonify(repair)
        else:
            return_error('Region not found.')
    except Exception as e:
        return_error(f'An unexpected error occurred: {e}')


@repair_api.route("/repairs/", methods=['POST'])
def create_repair():
    request_data = request.get_json()
    request_data = Repair.convertToFirebaseType(request_data)
    
    try:
        _, doc = repairs_ref.add(request_data)
        if (doc):
            return return_success("Create record successful")
    except Exception as e: 
        return return_error(f"Record creation failed: {e}")

@repair_api.route("/repairs/<repair_id>", methods=['PUT'])
def update_repair(repair_id):
    request_data = request.get_json()
    request_data = Repair.convertToFirebaseType(request_data)
    
    try:
        doc = repairs_ref.document(repair_id)
        if (doc):
            doc.update(request_data)
            return return_success("Update record successful")
        else:
            return return_error(f"Record not found: {repair_id}")
    except Exception as e: 
        return_error(f"Update record failed: {e}")


@repair_api.route("/repairs/<repair_id>", methods=['DELETE'])
def delete_repair(repair_id):
    print('delete_repair')


@repair_api.route("/repairs/ongoing", methods=['GET'])
def get_ongoing_repairs():
    try:
        ongoing_repairs = [(Repair.deserialize(doc)).serialize() for doc in repairs_ref.where(filter=FieldFilter('status', '==', 'Ongoing')).get()]

        return jsonify({
            'ongiongRepairs': ongoing_repairs
        })
    except Exception as e:
        return_error(f'An unexpected error occurred: {e}')
