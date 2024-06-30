import pandas as pd
from datetime import datetime, timezone
from flask import jsonify, Blueprint
from firebase import init_firebase
from firebase_admin import db, firestore
from google.cloud.firestore_v1.base_query import FieldFilter

from models.dmz import DMZ
from utils.response_utils import return_success, return_error

dmz_api = Blueprint('dmz_api', __name__)

# Firebase references
init_firebase()
firestore_db = firestore.client()
dmzs_ref = firestore_db.collection('dmz')
dmz_nrr_ref = firestore_db.collection('dmz_nrr')
hydraulics_ref = db.reference('hydraulics')


@dmz_api.route("/dmzs", methods=['GET'])
def get_all_dmzs():
    try:
        # Deserialize Firestore documents into DMZ objects, then serialize DMZ objects into JSON
        all_dmzs = [(DMZ.deserialize(doc)).serialize() for doc in dmzs_ref.order_by('latest_nrr', direction=firestore.Query.ASCENDING).get()]

        if all_dmzs:
            return jsonify({
                'dmzs': all_dmzs
            })
        else:
            return_error('No DMZ data found.')
    except Exception as e:
        print(repr(e))
        return_error(f'An unexpected error has occurred: {e}')


@dmz_api.route("/dmzs/<dmz_id>", methods=['GET'])
def get_dmz(dmz_id):
    try:
        dmz = (DMZ.deserialize(dmzs_ref.document(dmz_id).get())).serialize()

        if dmz:
            return jsonify({
                'dmz': dmz
            })
        else:
            return_error('DMZ not found.')
    except Exception as e:
        print(repr(e))
        return_error(f'An unexpected error has occurred: {e}')


@dmz_api.route("/dmzs/<dmz_id>", methods=['POST'])
def create_dmz(dmz_id):
    print('create_dmz')


@dmz_api.route("/dmzs/<dmz_id>", methods=['PUT'])
def update_dmz(dmz_id):
    print('update_dmz')


@dmz_api.route("/dmzs/<dmz_id>", methods=['DELETE'])
def delete_dmz(dmz_id):
    print('delete_dmz')


@dmz_api.route("/dmzs/<dmz_id>/nrr", methods=['GET'])
def get_dmz_nrr(dmz_id):
    try:        
        # Get NRR data of DMZ
        dmz_nrr_docs = dmz_nrr_ref.where(filter=FieldFilter('dmz_doc_id', '==', dmz_id)).order_by('timestamp', direction=firestore.Query.ASCENDING).get()
        dmz_nrr_data = [doc.to_dict() for doc in dmz_nrr_docs]
        
        for item in dmz_nrr_data:
            item['timestamp'] = int(item.get('timestamp').timestamp()) * 1000

        return jsonify({
            'dmzNRR': dmz_nrr_data
        })
    except Exception as e:
        print(repr(e))
        return_error(f'An unexpected error has occurred: {e}')


@dmz_api.route("/dmzs/<dmz_id>/mnf", methods=['GET'])
def get_dmz_mnf(dmz_id):
    try:
        # Get official identifier of DMZ
        selected_dmz = DMZ.deserialize(dmzs_ref.document(dmz_id).get())
        dmz_identifer = selected_dmz.id
        
        # Get past flow data of DMZ
        #dmz_hydraulics_snapshots = hydraulics_ref.order_by_child('dmz_id').equal_to(dmz_identifer).get()
        dmz_hydraulics_snapshots = hydraulics_ref.order_by_child('dmz_id').equal_to(dmz_identifer).limit_to_last(1000).get() # USE THIS FOR TESTING
        hydraulics_df = pd.DataFrame([value for key, value in dmz_hydraulics_snapshots.items()])
        
        # Get MNF for every day
        hydraulics_df['dt'] = pd.to_datetime(hydraulics_df['dt'], unit='ms')
        mnf_start_time = pd.to_datetime('00:00:00').time()
        mnf_end_time = pd.to_datetime('05:00:00').time()
        # Get indices of rows that have the MNF
        mnf_idx = hydraulics_df.loc[(hydraulics_df['dt'].dt.time >= mnf_start_time) & (hydraulics_df['dt'].dt.time <= mnf_end_time)].groupby([hydraulics_df['dt'].dt.date])['flow'].idxmin()
        mnf_idx = mnf_idx.reset_index()
        # Get the rows that have the MNF
        mnf_df = hydraulics_df.loc[mnf_idx['flow']]
        mnf_df = mnf_df.reset_index()
        # Convert datetime to timestamp
        mnf_df['dt'] = pd.to_datetime(mnf_df['dt'])
        mnf_df['dt'] = mnf_df['dt'].values.astype('int64') / 1000000
        # Drop columns with any NaN value
        # - datetime and flow should be unaffected as those were cleaned beforehand
        # - this is necessary because for some reason any rows with NaN value would cause React's setState to parse the entire array into an empty array
        mnf_df = mnf_df.dropna(axis=1)

        # Convert dataframe to JSON
        mnf_json = mnf_df.to_dict(orient='records')
        
        if mnf_json:
            return jsonify({
                'dmzMNF': mnf_json
            })
        else:
            return_error('Minimum Night Flow (MNF) data not found for this DMZ.')
    except Exception as e:
        return_error(f'An unexpected error has occurred: {e}')


@dmz_api.route("/dmzs/<dmz_id>/today-flow", methods=['GET'])
def get_dmz_today_flow(dmz_id):
    try:
        # Get official identifier of DMZ
        selected_dmz = DMZ.deserialize(dmzs_ref.document(dmz_id).get())
        dmz_identifer = selected_dmz.id
        
        # Get today's flow data of DMZ
        dmz_hydraulics_snapshots = hydraulics_ref.order_by_child('dmz_id').equal_to(dmz_identifer).get()
        
        dmz_hydraulics = []
        for key, value in dmz_hydraulics_snapshots.items():
            dt = datetime.fromtimestamp(value['dt'] / 1000, timezone.utc)
            custom_dt = datetime.strptime('Jan 28 2023', '%b %d %Y') # We need to hardcode this date as we do not have realtime hydraulics data
            currentDate = datetime.now(timezone.utc).date()

            if dt.date() == custom_dt.date():
                dmz_hydraulics.append(value)
        
        if dmz_hydraulics:
            return jsonify({
                'dmzTodayFlow': dmz_hydraulics
            })
        else:
            return_error('Today\'s flow data not found for this DMZ.')
    except Exception as e:
        return_error(f'An unexpected error has occurred: {e}')


@dmz_api.route("/dmzs/<dmz_id>/past-flow", methods=['GET'])
def get_dmz_past_flow(dmz_id):
    try:
        # Get official identifier of DMZ
        selected_dmz = DMZ.deserialize(dmzs_ref.document(dmz_id).get())
        dmz_identifer = selected_dmz.id
        
        # Get past flow data of DMZ
        #dmz_hydraulics_snapshots = hydraulics_ref.order_by_child('dmz_id').equal_to(dmz_identifer).get()
        dmz_hydraulics_snapshots = hydraulics_ref.order_by_child('dmz_id').equal_to(dmz_identifer).limit_to_last(100).get() # USE THIS FOR TESTING
        dmz_hydraulics = [value for key, value in dmz_hydraulics_snapshots.items()]
        
        if dmz_hydraulics:
            return jsonify({
                'dmzPastFlow': dmz_hydraulics
            })
        else:
            return_error('Past flow data not found for this DMZ.')
    except Exception as e:
        return_error(f'An unexpected error has occurred: {e}')
