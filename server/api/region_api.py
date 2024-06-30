import pandas as pd
from flask import jsonify, Blueprint
from firebase import init_firebase
from firebase_admin import firestore
from google.cloud.firestore_v1.base_query import FieldFilter

from models.region import Region
from utils.response_utils import return_success, return_error

region_api = Blueprint('region_api', __name__)

# Firebase references
init_firebase()
db = firestore.client()
regions_ref = db.collection('regions')
region_nrr_ref = db.collection('region_nrr')


@region_api.route("/regions", methods=['GET'])
def get_all_regions():
    try:
        # Deserialize Firestore documents into Region objects, then serialize Region objects into JSON
        all_regions = [(Region.deserialize(doc)).serialize() for doc in regions_ref.order_by('latest_nrr', direction=firestore.Query.ASCENDING).get()]

        if all_regions:
            return jsonify({
                'regions': all_regions
            })
        else:
            return_error('No region data found.')
    except Exception as e:
        return_error(f'An unexpected error occurred: {e}')


@region_api.route("/regions/<region_id>", methods=['GET'])
def get_region(region_id):
    try:
        region = regions_ref.document(region_id).get().to_dict()
        
        if region:
            return jsonify(region)
        else:
            return_error('Region not found.')
    except Exception as e:
        return_error(f'An unexpected error occurred: {e}')


@region_api.route("/regions/<region_id>", methods=['POST'])
def create_region(region_id):
    print('create_region')


@region_api.route("/regions/<region_id>", methods=['PUT'])
def update_region(region_id):
    print('update_region')


@region_api.route("/regions/<region_id>", methods=['DELETE'])
def delete_region(region_id):
    print('delete_region')


@region_api.route("/regions/<region_id>/nrr", methods=['GET'])
def get_region_nrr(region_id):
    try:        
        # Get NRR data of Region
        region_nrr_docs = region_nrr_ref.where(filter=FieldFilter('region_id', '==', region_id)).order_by('timestamp', direction=firestore.Query.ASCENDING).get()
        region_nrr_data = [doc.to_dict() for doc in region_nrr_docs]
        
        for item in region_nrr_data:
            item['timestamp'] = int(item.get('timestamp').timestamp()) * 1000

        return jsonify({
            'regionNRR': region_nrr_data
        })
    except Exception as e:
        print(repr(e))
        return_error(f'An unexpected error has occurred: {e}')
