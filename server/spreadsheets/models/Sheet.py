from datetime import datetime
from spreadsheets.extensions import db
from spreadsheets.common import generate_uuid

"""
    Sheet model for storing sheet data
"""
class Sheet(db.Model):
    __tablename__ = 'sheets__sheets'

    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    title = db.Column(db.Unicode(200))
    cells = db.Column(db.JSON)
    date_created = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    date_updated = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
