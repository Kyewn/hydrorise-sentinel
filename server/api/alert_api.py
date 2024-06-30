import json
from flask import jsonify, Blueprint, request
from firebase import init_firebase
from firebase_admin import firestore
from google.cloud.firestore_v1.base_query import FieldFilter

from models.alert import Alert
from utils.response_utils import return_success, return_error

alert_api = Blueprint('alert_api', __name__)

# Firebase references
init_firebase()
db = firestore.client()
alerts_ref = db.collection('alerts')


@alert_api.route("/alerts", methods=['GET'])
def get_all_alerts():
    try:
        # Deserialize Firestore documents into Alert objects, then serialize Alert objects into JSON
        all_alerts = [(Alert.deserialize(doc)).serialize() for doc in alerts_ref.limit(50).get()]
        for alert in all_alerts:
            dmz_doc = db.collection('dmz').document(alert['dmz_doc_id']).get().to_dict()
            alert['area_name'] = dmz_doc["area_name"]
            alert['dmz_name'] = dmz_doc["name"]            

        if all_alerts:
            return jsonify({
                'alerts': json.dumps(all_alerts)
            })
        else:
            return return_error('No alert data found.')
    except Exception as e:
        print(repr(e))
        return return_error(f'An unexpected error occurred: {e}')


@alert_api.route("/alerts/<alert_id>", methods=['GET'])
def get_alert(alert_id):
    try:
        alert = (Alert.deserialize(alerts_ref.document(alert_id).get())).serialize()
        
        if alert:
            return jsonify({
                'alert': alert
            })
        else:
            return return_error('Region not found.')
    except Exception as e:
        print(repr(e))
        return return_error(f'An unexpected error occurred: {e}')


@alert_api.route("/alerts/<alert_id>", methods=['POST'])
def create_alert(alert_id):
    print('create_alert')


@alert_api.route("/alerts/<alert_id>", methods=['PUT'])
def update_alert(alert_id):
    try:
        json = request.get_json()
        json = Alert.convertToFirebaseType(json)


        alert = alerts_ref.document(alert_id)
        if alert:
            alert.update(json)

        return return_success("Alert updated successfully.")
    except Exception as e:
        return return_error(f'An unexpected error occurred: {e}')


@alert_api.route("/alerts/<alert_id>", methods=['DELETE'])
def delete_alert(alert_id):
    print('delete_alert')

@alert_api.route("/alerts/mark-all-as-read", methods=['POST'])
def mark_all_alerts_as_read():
    try: 
        for alert in alerts_ref.where(filter=FieldFilter('status', '==', 'unread')).get():
            alert.reference.update({'status': 'read'})
        return return_success("All alerts marked as read.")
    except Exception as e:
        return return_error(f'An unexpected error occurred: {e}')

@alert_api.route("/alerts/unread", methods=['GET'])
def get_unread_alerts():
    try:
        # Deserialize Firestore documents into Alert objects, then serialize Alert objects into JSON
        unread_alerts = [(Alert.deserialize(doc)).serialize() for doc in alerts_ref.where(filter=FieldFilter('status', '==', 'unread')).limit(50).get()]

        for alert in unread_alerts:
            dmz_doc = db.collection('dmz').document(alert['dmz_doc_id']).get().to_dict()
            alert['area_name'] = dmz_doc["area_name"]
            alert['dmz_name'] = dmz_doc["name"] 

        if unread_alerts:
            return jsonify({
                'unreadAlerts': json.dumps(unread_alerts)
            })
        else:
            return return_error('No alert data found.')
    except Exception as e:
        print(repr(e))
        return return_error(f'An unexpected error occurred: {e}')

