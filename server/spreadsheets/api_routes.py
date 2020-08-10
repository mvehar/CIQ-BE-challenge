from spreadsheets.extensions import api
from spreadsheets.resources.SheetResource import SheetResource, SheetsResource

def add_resources(app):
    api.add_resource(SheetsResource, '/spreadsheets')
    api.add_resource(SheetResource, '/spreadsheets/<id>')
