from marshmallow_sqlalchemy import SQLAlchemySchema, auto_field
from spreadsheets.models import Sheet

""" Serialization schema for Spreadsheet model """
class SheetSchema(SQLAlchemySchema):
    class Meta:
        model = Sheet

    id = auto_field()
    title = auto_field()
    cells = auto_field()
    date_created = auto_field()
    date_updated = auto_field()

# Single model
sheet_schema = SheetSchema()
# List of model
sheets_schema = SheetSchema(many=True)