import firebase_admin
from firebase_admin import credentials


def init_firebase():
    if not firebase_admin._apps:
        cred = credentials.Certificate("serviceAccountKey.json")
        firebase_admin.initialize_app(cred, {
            'databaseURL': 'https://hydrorise-sentinel-default-rtdb.asia-southeast1.firebasedatabase.app',
            'storageBucket': 'gs://hydrorise-sentinel.appspot.com'
        })