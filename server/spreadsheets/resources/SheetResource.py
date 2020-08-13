from flask import request
from flask_restful import Resource, abort

from spreadsheets.extensions import db
from spreadsheets.models import Sheet
from spreadsheets.schemas.SheetSchema import sheet_schema, sheets_schema

""" 
REST Endpoint for Spreadsheet
"""


class SheetResource(Resource):
    # TODO: JWT protection

    def get(self, id):
        if not id:
            return abort(400, message='Invalid request')

        sheet = Sheet.query.get_or_404(id)

        return sheet_schema.dump(sheet)

    def post(self):
        sheet_request = request.get_json(force=True)
        if not sheet_request:
            return abort(400, message='Invalid request')

        sheet = sheet_schema.load(data=sheet_request, session=db.session)

        db.session.add(sheet)
        db.session.commit()

        return sheet_schema.dump(sheet)

    def patch(self, id):
        sheet_request = request.get_json(force=True)
        if not sheet_request or not id:
            return abort(400, message='Invalid request')

        sheet = Sheet.query.get_or_404(id)

        sheet = sheet_schema.load(data=sheet_request, instance=sheet, session=db.session)

        db.session.commit()

        return sheet_schema.dump(sheet)

    def delete(self, id):
        if not id:
            return abort(400, message='Invalid request')

        sheet = Sheet.query.get_or_404(id)

        db.session.delete(sheet)
        db.session.commit()


""" REST Endpoint for fetching list of Spreadsheets"""


class SheetsResource(Resource):
    # TODO: JWT protect
    def get(self):
        sheets = Sheet.query.all()

        return sheets_schema.dump(sheets)
