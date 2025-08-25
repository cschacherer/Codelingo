from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import event
from sqlalchemy.engine import Engine

db = SQLAlchemy()


class DatabaseConfig:
    def __init__(self, app=None):
        if app:
            self.init_app(app)

    def init_app(self, app):
        db.init_app(app)
