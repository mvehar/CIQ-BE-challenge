"""
    Configuration object

    Load parameters from env.
"""


class Config(object):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///spreadsheets.db"
    WTF_CSRF_ENABLED = True
    SQLALCHEMY_ECHO = False
    CACHE_TYPE = "simple"
    CACHE_DEFAULT_TIMEOUT = 300
    STATIC_FOLDER = '../static'
