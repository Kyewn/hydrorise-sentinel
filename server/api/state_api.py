from flask import jsonify, Blueprint
from firebase import init_firebase
from firebase_admin import firestore
from google.cloud.firestore_v1.base_query import FieldFilter

from utils.response_utils import return_success, return_error

state_api = Blueprint('state_api', __name__)

# Firebase references
init_firebase()
db = firestore.client()
state_nrr_ref = db.collection('state_nrr')


@state_api.route("/state/nrr", methods=['GET'])
def get_state_nrr():
    try:        
        # Get NRR data of whole State
        state_nrr_docs = state_nrr_ref.order_by('timestamp', direction=firestore.Query.ASCENDING).get()
        state_nrr_data = [doc.to_dict() for doc in state_nrr_docs]
        
        for item in state_nrr_data:
            item['timestamp'] = int(item.get('timestamp').timestamp()) * 1000

        if state_nrr_data:
            return jsonify({
                'stateNRR': state_nrr_data
            })
        else:
            return_error('State NRR data not found.')
    except Exception as e:
        print(repr(e))
        return_error(f'An unexpected error has occurred: {e}')


@state_api.route("/state/latest-nrr", methods=['GET'])
def get_state_latest_nrr():
    try:        
        # Get latest state NRR
        state_nrr_doc = state_nrr_ref.order_by('timestamp', direction=firestore.Query.DESCENDING).limit(1).get()

        if state_nrr_doc:
            return jsonify({
                'stateNRR': state_nrr_doc[0].to_dict().get('value')
            })
        else:
            return_error('Latest state NRR data not found.')
    except Exception as e:
        print(repr(e))
        return_error(f'An unexpected error has occurred: {e}')
