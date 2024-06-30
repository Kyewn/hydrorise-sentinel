import os

class Config:
    DEBUG = False
    TESTING = False
    SECRET_KEY = ''


class DevelopmentConfig(Config):
    DEBUG = True


class ProductionConfig(Config):
    SECRET_KEY = ''


class TestingConfig(Config):
    Testing = True


environment = os.environ.get('FLASK_ENV', 'development')

if environment == 'production':
    app_config = ProductionConfig()
elif environment == 'testing':
    app_config = TestingConfig()
else:
    app_config = DevelopmentConfig()
