from flask_restful import Resource

from spreadsheets.models import Sheet
from spreadsheets.extensions import db
from spreadsheets.schemas.SheetSchema import sheet_schema, sheets_schema

""" REST Endpoint for Spreadsheet"""
class SheetResource(Resource):
    # TODO: JWT protect
    def get(self, id):
        sheet = Sheet.query.get(id)

        return sheet_schema.dump(sheet)

""" REST Endpoint for fetching list of Spreadsheets"""
class SheetsResource(Resource):
    # TODO: JWT protect
    def get(self):
        sheets = Sheet.query.all()

        return sheets_schema.dump(sheets)