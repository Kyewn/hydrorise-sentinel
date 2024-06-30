import pandas as pd
import statistics as st
from datetime import datetime
from flask import jsonify, Blueprint
from firebase import init_firebase
from firebase_admin import db, firestore
from google.cloud.firestore_v1.base_query import FieldFilter

from models.dmz import DMZ
from models.hydraulic import Hydraulic
from models.region import Region
from models.repair import Repair
from utils.response_utils import return_success, return_error

hydraulic_api = Blueprint('hydraulic_api', __name__)

# Firebase references
init_firebase()
firestore_db = firestore.client()
alerts_ref = firestore_db.collection('alerts')
dmzs_ref = firestore_db.collection('dmz')
regions_ref = firestore_db.collection('regions')
dmz_nrr_ref = firestore_db.collection('dmz_nrr')
region_nrr_ref = firestore_db.collection('region_nrr')
state_nrr_ref = firestore_db.collection('state_nrr')
repairs_ref = firestore_db.collection('repairs')
hydraulics_ref = db.reference('hydraulics')


@hydraulic_api.route("/hydraulics", methods=['GET'])
def get_all_hydraulics():
    try:
        all_hydraulics = hydraulics_ref.order_by_child("dt").limit_to_last(50).get()

        if all_hydraulics:
            return jsonify(all_hydraulics)
        else:
            return return_error('No hydraulics data found.')
    except Exception as e:
        return return_error(f'An unexpected error occurred: {e}')


@hydraulic_api.route("/hydraulics/<hydraulic_id>", methods=['GET'])
def get_hydraulic(hydraulic_id):
    try:
        hydraulic = hydraulics_ref.child(hydraulic_id).get()
        
        if hydraulic:
            return jsonify(hydraulic)
        else:
            return_error('Region not found.')
    except Exception as e:
        return_error(f'An unexpected error occurred: {e}')


@hydraulic_api.route("/hydraulics/<hydraulic_id>", methods=['POST'])
def create_hydraulic(hydraulic_id):
    print('create_hydraulic')


@hydraulic_api.route("/hydraulics/<hydraulic_id>", methods=['PUT'])
def update_hydraulic(hydraulic_id):
    print('update_hydraulic')


@hydraulic_api.route("/hydraulics/<hydraulic_id>", methods=['DELETE'])
def delete_hydraulic(hydraulic_id):
    print('delete_hydraulic')


@hydraulic_api.route("/hydraulics/update-nrr", methods=['GET'])
def update_nrr():
    FLOW_CONVERSION_FACTOR = 86.4   # Conversion factor between litres per second and cubic metres per second

    try:
        # Get all DMZs
        dmz_list = [DMZ.deserialize(doc) for doc in dmzs_ref.get()]

        # Get all regions
        region_list = [Region.deserialize(doc) for doc in regions_ref.get()]
        region_nrr = {region.doc_id: 0 for region in region_list}

        # Get all hydraulics data from the past year
        hydraulics_snapshots = hydraulics_ref.order_by_child('dmz_id').get()
        hydraulics_df = pd.DataFrame([snapshot for snapshot in hydraulics_snapshots])
        hydraulics_df['dt'] = pd.to_datetime(hydraulics_df['dt'], unit='ms') # Convert timestamp to datetime

        # Get all completed repair data from the past year
        repair_docs = [doc.to_dict() for doc in repairs_ref.where(filter=FieldFilter('status', '==', 'Completed')).get()]
        repairs_df = pd.DataFrame([doc for doc in repair_docs])
        
        # Calculate NRR for every DMZ
        for dmz in dmz_list:
            # Filter hydraulics data for current DMZ
            dmz_hydraulics_df = hydraulics_df.loc[hydraulics_df['dmz_id'] == dmz.id]

            # Filter repairs data for current DMZ
            dmz_repairs_df = repairs_df.loc[repairs_df['dmz_id'] == dmz.id]
            dmz_repairs_grouped_df = dmz_repairs_df.groupby([dmz_repairs_df['dt_closed'].dt.date]).last()

            # Only proceed if DMZ has existing repairs data
            if dmz_repairs_grouped_df.shape[0] > 0:
                # Get MNF for every day
                mnf_start_time = pd.to_datetime('00:00:00').time()
                mnf_end_time = pd.to_datetime('05:00:00').time()
                # Get indices of rows that have the MNF
                mnf_idx = dmz_hydraulics_df.loc[(dmz_hydraulics_df['dt'].dt.time >= mnf_start_time) & (dmz_hydraulics_df['dt'].dt.time <= mnf_end_time)].groupby([dmz_hydraulics_df['dt'].dt.date])['flow'].idxmin()
                mnf_idx = mnf_idx.reset_index()
                # Get the rows that have the MNF
                mnf_df = dmz_hydraulics_df.loc[mnf_idx['flow']]
                mnf_df = mnf_df.reset_index()
                
                # Merge MNF data into grouped repair data for NRR calculation
                repairs_mnf_df = pd.merge(dmz_repairs_grouped_df, mnf_df, how='left', left_on=dmz_repairs_grouped_df['dt_closed'].dt.date, right_on=mnf_df['dt'].dt.date)
                repairs_mnf_df = repairs_mnf_df.rename(columns={'flow': 'mnf'})
                
                # Calculate NRR
                # 1) identify periods between repairs where MNF increases, ignore periods where MNF decreases
                #    using diff() function, we can get the difference between every row's MNF with the previous row's MNF
                #    there is an increase if the result is above 0
                # 2) for every repair
                #    if mnf_diff > 0: MNFsum += mnf_diff, Tsum += Tdiff
                # 3) NRR: MNFsum/Tsum * 365 = ?
                repairs_mnf_df['dt_diff'] = repairs_mnf_df['dt_closed'].dt.date.diff()
                repairs_mnf_df['mnf_diff'] = repairs_mnf_df['mnf'].diff()
                print(repairs_mnf_df[['dt_closed', 'mnf', 'mnf_diff', 'dt_diff']])

                mnf_total, time_total = 0, 0
                for index, row in repairs_mnf_df.iterrows():
                    mnf_diff = row['mnf_diff']
                    if mnf_diff > 0:
                        dt_diff = row['dt_diff'].days
                        mnf_total += mnf_diff
                        time_total += dt_diff
                        
                print('Total MNF (l/s): {}'.format(mnf_total))
                print('Total MNF (m^3/day): {}'.format(mnf_total * FLOW_CONVERSION_FACTOR))
                print('Total Time (days): {}'.format(time_total))

                nrr = ((mnf_total * FLOW_CONVERSION_FACTOR)/time_total) * 365
                print('NRR (m^3/day/year): {}'.format(nrr))

                # Update DMZ latest NRR
                dmzs_ref.document(dmz.doc_id).update({
                    'latest_nrr': nrr
                })
                dmz.latest_nrr = nrr

                # Save DMZ NRR record
                new_dmz_nrr = {
                    'dmz_doc_id': dmz.doc_id,
                    'dmz_id': dmz.id,
                    'value': nrr,
                    'timestamp': datetime.now()
                }
                dmz_nrr_ref.add(new_dmz_nrr)

                # Accumulate region NRR
                region_nrr[dmz.region_id] += nrr

        state_nrr = 0
        # Iterate region NRR dict
        for doc_id, nrr in region_nrr.items():
            # Update Region latest NRR
            regions_ref.document(doc_id).update({
                'latest_nrr': nrr
            })

            # Save region NRR record
            new_region_nrr = {
                'region_id': doc_id,
                'value': nrr,
                'timestamp': datetime.now()
            }
            region_nrr_ref.add(new_region_nrr)

            # Accumulate state NRR
            state_nrr += nrr

        # Save state NRR record
        new_state_nrr = {
            'value': state_nrr,
            'timestamp': datetime.now()
        }
        state_nrr_ref.add(new_state_nrr)

        # Create alert for NRRs that breach median threshold
        nrr_median = st.median([dmz.latest_nrr for dmz in dmz_list])
        for dmz in dmz_list:
            if dmz.latest_nrr > nrr_median:
                new_alert = {
                    'dmz_doc_id': dmz.doc_id,
                    'dmz_id': dmz.id,
                    'nrr': dmz.latest_nrr,
                    'description': 'NRR breached median NRR value of all DMZs',
                    'status': 'unread',
                    'timestamp': datetime.now()
                }
                alerts_ref.add(new_alert)

        return_success('Successfully updated NRR for DMZs, regions, and state.')
    except Exception as e:
        print(repr(e))
        return_error(f'An unexpected error has occurred: {e}')
