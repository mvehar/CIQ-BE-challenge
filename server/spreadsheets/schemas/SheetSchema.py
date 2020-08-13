from marshmallow_sqlalchemy import auto_field, SQLAlchemyAutoSchema

from spreadsheets.models import Sheet

""" Serialization schema for Spreadsheet model """


class SheetSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Sheet
        load_instance = True

    id = auto_field('id')
    title = auto_field('title')
    cells = auto_field('cells')
    date_created = auto_field('date_created')
    date_updated = auto_field('date_updated')


# Single model
sheet_schema = SheetSchema()
# List of model
sheets_schema = SheetSchema(many=True)
