from flask import Flask
from flask_migrate import MigrateCommand

from spreadsheets.config import Config
from spreadsheets.api_routes import add_resources
from spreadsheets.extensions import api, db, ma, migrate

DEFAULT_APP_NAME = "spreadsheets"

"""
    INITIAL Flask bootstrap function
"""


def create_app(config=None):
    app = Flask(DEFAULT_APP_NAME)

    if config is None:
        config = Config()

    configure_app(app, config)
    configure_extensions(app)
    configure_routes(app)

    return app


"""
    Register configuration for the app
"""


def configure_app(app, config):
    app.config.from_object(config)


"""
    Register extensions for flask application

    e.g. Datatabases, cache, mail and other tools
"""


def configure_extensions(app):
    db.init_app(app)
    api.init_app(app)
    ma.init_app(app)
    migrate.init_app(app, db)


"""
    Register REST resources and paths
"""


def configure_routes(app):
    add_resources(app)
