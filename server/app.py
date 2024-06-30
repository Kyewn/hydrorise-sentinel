from config import app_config
from flask import Flask
from flask_cors import CORS
from firebase import init_firebase

from api.alert_api import alert_api
from api.dmz_api import dmz_api
from api.state_api import state_api
from api.hydraulic_api import hydraulic_api
from api.region_api import region_api
from api.repair_api import repair_api
from api.user_api import user_api

# Initialize Flask application
app = Flask(__name__)

# Setup cross-origin resource sharing (CORS)
cors = CORS(app, origins='*')

# Initialize Firebase Admin SDK
init_firebase()

# Register blueprints
app.register_blueprint(dmz_api)
app.register_blueprint(region_api)
app.register_blueprint(state_api)
app.register_blueprint(user_api)
app.register_blueprint(hydraulic_api)
app.register_blueprint(alert_api)
app.register_blueprint(repair_api)

if __name__ == "__main__":
    app.config.from_object(app_config)
    app.run(debug=True, port=8080)
