from flask_script import Manager
from flask_migrate import MigrateCommand

from spreadsheets import create_app
from spreadsheets.extensions import db

app = create_app()

if __name__ == '__main__':
    manager = Manager(app)
    manager.add_command('db', MigrateCommand)
    # manager.run()

    print(app.url_map)