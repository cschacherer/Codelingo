import os

class Config:
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    SQLALCHEMY_DATABASE_URI = f"sqlite:///{os.path.join(BASE_DIR, 'database', 'codelingo.db')}"
    TESTING_SQLALCHEMY_DATABASE_URI = f"sqlite:///{os.path.join(BASE_DIR, 'tests', 'codelingo_TESTING.db')}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
