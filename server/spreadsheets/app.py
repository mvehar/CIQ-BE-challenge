from flask import Flask, send_from_directory

from spreadsheets.api_routes import add_resources
from spreadsheets.config import Config
from spreadsheets.extensions import api, db, ma, migrate
from werkzeug.utils import redirect

DEFAULT_APP_NAME = "spreadsheets"

"""
    INITIAL Flask bootstrap function
"""


def create_app(config=None):
    app = Flask(DEFAULT_APP_NAME, static_url_path='')

    if config is None:
        config = Config()

    configure_app(app, config)
    configure_extensions(app)
    configure_routes(app)
    configure_static(app)

    return app


"""
    Register configuration for the app
"""


def configure_app(app, config):
    app.config.from_object(config)

    app.static_folder = config.STATIC_FOLDER


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


"""
    Register STATIC paths
"""


def configure_static(app):
    @app.route('/static/<path:path>')
    def send_static(path):
        print(path)

        return send_from_directory('../static/static', path)

    @app.route('/<path:filename>')
    def send_general(filename):
        print(filename)
        return send_from_directory('../static', filename)

    @app.route('/')
    def send_index():
        return redirect('/index.html')
