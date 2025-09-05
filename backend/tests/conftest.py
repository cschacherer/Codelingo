import pytest
from application import createApp
from database.models import db
from database.databaseSeeder import DatabaseSeeder


@pytest.fixture(scope="session")
def app():
    app = createApp(testing=True)
    with app.app_context():
        db.create_all()
        DatabaseSeeder.seed()  # filling database with test data
    yield app


@pytest.fixture(scope="session")
def testClient(app):
    with app.test_client() as c:
        yield c
