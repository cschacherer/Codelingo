from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import event
from sqlalchemy.engine import Engine

db = SQLAlchemy()

class DatabaseConfig(): 
    def __init__(self, app=None): 
        if app: 
            self.init_app(app)

    def init_app(self, app): 
        db.init_app(app)

    # Enable foreign key constraints in SQLite, you cannot set it in the config file
    @event.listens_for(Engine, "connect")
    def enable_sqlite_fks(dbapi_connection, connection_record):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()