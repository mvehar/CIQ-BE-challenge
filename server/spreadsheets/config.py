class Config(object):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///spreadsheets.db"
    SQLALCHEMY_ECHO = False
    CACHE_TYPE = "simple"
    CACHE_DEFAULT_TIMEOUT = 300