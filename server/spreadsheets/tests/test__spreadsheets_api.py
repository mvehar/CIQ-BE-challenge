import json
import unittest

from flask_testing import TestCase

from spreadsheets import create_app
from spreadsheets.config import Config
from spreadsheets.extensions import db, api


class SpreadsheetsTest(TestCase):

    def create_app(self):
        config = Config()
        config.SQLALCHEMY_DATABASE_URI = "sqlite:///test.db"
        config.PRESERVE_CONTEXT_ON_EXCEPTION = False
        config.DEBUG = True
        config.WTF_CSRF_ENABLED = False

        app = create_app(config)
        api.init_app(app)
        db.init_app(app)

        return app

    # executed before each test
    def setUp(self):
        api.resources = []
        db.create_all()

    # executed after each test
    def tearDown(self):
        db.session.remove()
        # db.drop_all()
        pass

    def test_get_list(self):
        response = self.client.get('/spreadsheets')
        self.assert200(response, 'List spreadsheets failed!')

    def test_post_sheet(self):
        data = json.dumps({
            'title': 'test',
            'cells': '[]',
        })
        response = self.client.post('/spreadsheet', data=data)

        self.assert200(response)
        id = response.get_json(force=True).get('id')
        self.assertIsNotNone(id)

        response = self.client.delete('/spreadsheet/' + id)
        self.assert200(response)

    # Test PATCH
    def test_patch_sheet(self):
        data = {
            'title': 'test',
            'cells': '[]',
        }
        response = self.client.post('/spreadsheet', data=json.dumps(data))
        self.assert200(response)
        self.assertIsNotNone(response.get_json(force=True).get('id'))

        id = response.get_json(force=True).get('id')

        new_title = 'new title'
        data['title'] = new_title

        response = self.client.patch('/spreadsheet/' + id, data=json.dumps(data))
        self.assert200(response)
        self.assertEqual(response.get_json(force=True).get('title'), new_title)

        id = response.get_json(force=True).get('id')
        self.assertIsNotNone(id)

        response = self.client.delete('/spreadsheet/' + id)
        self.assert200(response)


if __name__ == "__main__":
    unittest.main()
