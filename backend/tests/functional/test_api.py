import pytest
import sqlalchemy 
import random
from database.models import User
from database.models import SavedQuestion
from database.dbConfig import db

def test_homePageSuccess(testClient): 
    response = testClient.get('/')
    assert response.status_code == 200
    assert response.is_json == True 

    #these are the default values when none are specified 
    assert str(response.json['category']).lower() == 'python'
    assert str(response.json['difficulty']).lower() == 'hard'
    assert str(response.json['type']).lower() == 'coding'
    assert response.json['question'] != None


def test_homePageFailPost(testClient): 
    response = testClient.post('/')
    assert response.status_code == 405

def test_getAllUsersSuccess(testClient): 
    response = testClient.get('/users')
    assert response.status_code == 200 and response.get_json() != None

def test_registerUserSuccess(testClient): 
    newUser = createNewRandomUser()
    response = testClient.post('/register', json=newUser)
    responseMsg = str(response.get_json()['msg'])
    assert response.status_code == 200 and responseMsg == 'Registered user'

def test_registerUserFailNoPassword(testClient): 
    newUser = createNewRandomUser()
    del newUser['password']
    response = testClient.post('/register', json=newUser)
    responseMsg = str(response.get_json()['msg'])
    assert response.status_code == 400 and responseMsg == 'Username or password cannot be missing'

def test_registerUserFailExistingUsername(testClient): 
    existingUser = getExistingUser()
    #don't want to send user's actual encrypted password so use a dummy one 
    user = {
        "username": existingUser.username, 
        "password": "password123"
    }
    response = testClient.post('/register', json=user)
    responseMsg = str(response.get_json()['msg'])
    assert response.status_code == 400 and responseMsg == 'User with that username already exists'

def test_registerAndLoginUserSuccess(testClient): 
    newUser = createNewRandomUser()
    postResponse = testClient.post('/register', json=newUser)
    loginResponse = testClient.post('/login', json=newUser)
    loginResponseMsg = loginResponse.get_json()['msg']
    assert (postResponse.status_code == 200 and 
            loginResponse.status_code == 200 and 
            loginResponseMsg == 'Logged in user')

def test_loginExistingUserFailPassword(testClient): 
    existingUser = getExistingUser()
    diffPasswordUser = {
        "username": existingUser.username, 
        "password": "fA88F2K00988"
    }
    loginResponse = testClient.post('/login', json=diffPasswordUser)
    loginResponseMsg = loginResponse.get_json()['msg']
    assert (loginResponse.status_code == 400 and 
            loginResponseMsg == 'Wrong password')


def test_saveQuestionSuccess(testClient):
    existingUser = getExistingUser()
    question = SavedQuestion(category='Python', difficulty='Hard', type='Theoretical', question='python hard question', answer='correct chatgpt answer', 
                        userAnswer='user answer', notes='this is a note', userId=existingUser.id)
    db.session.add(question)
    db.session.commit()
    savedQuestion = SavedQuestion.query.all().pop()
    assert question.compareValues(savedQuestion)
    
def test_saveQuestionFailForeignKey(testClient):
    with pytest.raises(sqlalchemy.exc.IntegrityError) as foreignKeyError: 
        question = SavedQuestion(category="Python", difficulty='Hard', type='Theoretical', question='python hard question', answer='correct chatgpt answer', 
                            userAnswer='user answer', notes='this is a note', userId=-10)
        db.session.add(question)
        db.session.commit()
    assert("FOREIGN KEY constraint failed" in str(foreignKeyError.value))
    db.session.rollback()

def test_saveQuestionFailNullContstraint(testClient): 
    with pytest.raises(sqlalchemy.exc.IntegrityError) as nullError: 
        firstUser = User.query.first()
        question = SavedQuestion(difficulty='Hard', type='Theoretical', question='python hard question', answer='correct chatgpt answer', 
                            userAnswer='user answer', notes='this is a note', userId=firstUser.id)
        db.session.add(question)
        db.session.commit()
    assert("NOT NULL constraint failed" in str(nullError.value))
    db.session.rollback()

#region Helper functions 
def createNewRandomUser(): 
    randomInt = random.randint(1, 1000)
    randomUsername = f"username{randomInt}"
    existingUser = User.query.filter_by(username=randomUsername).first()
    while existingUser != None: 
        randomInt = random.randint(1, 1000)
        randomUsername = f"username{randomInt}"
        existingUser = User.query.filter_by(username=randomUsername).first()
    newUser = {
        "username": randomUsername,
        "password": f"password{randomInt}"
    }
    return newUser

def getExistingUser(): 
    users = User.query.all()
    randomInt = random.randint(0, len(users) - 1)
    existingUser = users[randomInt]
    return existingUser
#endregion