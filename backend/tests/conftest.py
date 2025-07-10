import pytest  
from app import createApp

@pytest.fixture(scope="module")
def testClient(): 
    flask_app = createApp(testing=True)

    with flask_app.test_client() as testingClient: 
        yield testingClient