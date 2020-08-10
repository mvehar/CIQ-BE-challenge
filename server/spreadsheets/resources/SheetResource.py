from flask_restful import Resource

from spreadsheets.models import Sheet
from spreadsheets.extensions import db
from spreadsheets.schemas.SheetSchema import sheet_schema, sheets_schema

class SheetResource(Resource):
    # TODO: JWT protect
    def get(self, id):
        # TODO: Implement ORM calls
        sheet = Sheet.query.get(id)

        return sheet_schema.dump(sheet)


class SheetsResource(Resource):
    # TODO: JWT protect
    def get(self):
        # TODO: Implement ORM calls
        sheets = Sheet.query.all()

        return sheets_schema.dump(sheets)