from spreadsheets.extensions import api
from spreadsheets.resources.SheetResource import SheetResource, SheetsResource

"""
    Register resources under certain paths

    api.add_resource(RESOURCE, PATH_PATTERN)

    Docs: https://flask-restful.readthedocs.io/en/latest/quickstart.html#endpoints
"""
def add_resources(app):
    api.add_resource(SheetsResource, '/spreadsheets')
    api.add_resource(SheetResource, '/spreadsheets/<id>')
