import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

from mainApp import createApp

def testHomePage(): 
    flask_app = createApp()
    flask_app.config['TESTING'] = True 

    with flask_app.test_client() as testClient: 
        response = testClient.get('/')
        assert response.status_code == 200

def testHomePagePost(): 
    flask_app = createApp()
    flask_app.config['TESTING'] = True 

    with flask_app.test_client() as testClient: 
        response = testClient.post('/')
        assert response.status_code == 405

testHomePage()
testHomePagePost()