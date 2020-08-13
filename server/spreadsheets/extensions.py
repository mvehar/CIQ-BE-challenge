from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api
from flask_marshmallow import Marshmallow
from flask_migrate import Migrate

"""
    Extensions used by application
"""
db = SQLAlchemy()
api = Api()
ma = Marshmallow()
migrate = Migrate()
