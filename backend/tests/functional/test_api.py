import pytest
import sqlalchemy
import random
from database.models import User
from database.models import SavedQuestion
from database.dbConfig import db
import time


# region Login tests
def test_login_success(testClient):
    existingUser = getExistingUser()
    loginResponse = testClient.post("/login", json=existingUser)
    responseMsg = str(loginResponse.json["message"])
    assert loginResponse.status_code == 200 and responseMsg == "Logged in user"


def test_loginBadPassword_fail(testClient):
    existingUser = getExistingUser()
    existingUser["password"] = "wrongPassword"
    loginResponse = testClient.post("/login", json=existingUser)
    loginResponseMsg = loginResponse.json["message"]
    assert (
        loginResponse.status_code == 401
        and loginResponseMsg == "Invalid username or password"
    )


def test_loginBadUsername_fail(testClient):
    missingUser = {"username": "USERNAME_DOES_NOT_EXIST", "password": "BAD_PASSWORD"}
    loginResponse = testClient.post("/login", json=missingUser)
    loginResponseMsg = loginResponse.json["message"]
    assert (
        loginResponse.status_code == 401
        and loginResponseMsg == "Invalid username or password"
    )


def test_loginEmptyUser_fail(testClient):
    emptyUser = {"username": "", "password": ""}
    loginResponse = testClient.post("/login", json=emptyUser)
    loginResponseMsg = loginResponse.json["message"]
    assert (
        loginResponse.status_code == 400
        and loginResponseMsg == "Username or password cannot be missing"
    )


# endregion


# region Register tests
def test_register_success(testClient):
    newUser = createNewRandomUser()
    response = testClient.post("/register", json=newUser)
    responseMsg = str(response.json["message"])
    assert response.status_code == 200 and responseMsg == "Registered user"


def test_registerWithoutEmail_success(testClient):
    newUser = createNewRandomUser()
    del newUser["email"]
    response = testClient.post("/register", json=newUser)
    responseMsg = str(response.json["message"])
    assert response.status_code == 200 and responseMsg == "Registered user"


def test_registerNoPassword_fail(testClient):
    newUser = createNewRandomUser()
    del newUser["password"]
    response = testClient.post("/register", json=newUser)
    responseMsg = str(response.json["message"])
    assert (
        response.status_code == 400
        and responseMsg == "Username or password cannot be missing"
    )


def test_registerExistingUsername_fail(testClient):
    existingUser = getExistingUser()
    response = testClient.post("/register", json=existingUser)
    responseMsg = str(response.json["message"])
    assert (
        response.status_code == 400
        and responseMsg == "User with that username already exists"
    )


def test_registerExistingEmail_fail(testClient):
    newUser = createNewRandomUser()
    existingUser = getExistingUser()
    newUser["email"] = existingUser["email"]
    response = testClient.post("/register", json=newUser)
    responseMsg = str(response.json["message"])
    assert (
        response.status_code == 400
        and responseMsg == "User with that email already exists"
    )


def test_registerAndLogin_success(testClient):
    newUser = createNewRandomUser()
    postResponse = testClient.post("/register", json=newUser)
    loginResponse = testClient.post("/login", json=newUser)
    loginResponseMsg = loginResponse.json["message"]
    assert (
        postResponse.status_code == 200
        and loginResponse.status_code == 200
        and loginResponseMsg == "Logged in user"
    )


# endregion


# region Token Refresh test
def test_refreshToken_success(testClient):
    existingUser = getExistingUser()
    loginResponse = testClient.post("/login", json=existingUser)
    refreshToken = loginResponse.json["refreshToken"]
    authHeaders = {"Authorization": f"Bearer {refreshToken}"}
    tokenRefreshResponse = testClient.post("/token/refresh", headers=authHeaders)
    assert (
        tokenRefreshResponse.status_code == 200
        and tokenRefreshResponse.json["accessToken"] != None
    )


# endregion


# region User tests
def test_getUser_success(testClient):
    existingUser = getExistingUser()
    loginResponse = testClient.post("/login", json=existingUser)
    token = loginResponse.json["accessToken"]
    authHeaders = {"Authorization": f"Bearer {token}"}
    response = testClient.get("/user", headers=authHeaders)
    assert response.status_code == 200 and response.json != None


def test_getUser_fail(testClient):
    response = testClient.get("/user")
    assert response.status_code == 401


def test_patchUserPassword_success(testClient):
    newUser = createNewRandomUser()
    registerResponse = testClient.post("/register", json=newUser)
    token = registerResponse.json["accessToken"]
    authHeaders = {"Authorization": f"Bearer {token}"}
    newUser["password"] = "newPassword"
    response = testClient.patch("/user", headers=authHeaders, json=newUser)
    assert response.status_code == 200 and response.json != None


def test_patchUserEmail_success(testClient):
    newUser = createNewRandomUser()
    registerResponse = testClient.post("/register", json=newUser)
    token = registerResponse.json["accessToken"]
    authHeaders = {"Authorization": f"Bearer {token}"}
    newUser["email"] = "newEmail@test.com"
    response = testClient.patch("/user", headers=authHeaders, json=newUser)
    assert response.status_code == 200 and response.json != None


def test_patchUser_fail(testClient):
    response = testClient.patch("/user")
    assert response.status_code == 401


def test_deleteUser_success(testClient):
    newUser = createNewRandomUser()
    registerResponse = testClient.post("/register", json=newUser)
    token = registerResponse.json["accessToken"]
    authHeaders = {"Authorization": f"Bearer {token}"}
    response = testClient.delete("/user", headers=authHeaders)
    assert response.status_code == 200 and response.json["message"] == "User deleted"


def test_deleteUser_fail(testClient):
    response = testClient.delete("/user")
    assert response.status_code == 401


# endregion


# region Reset Password Email tests


def test_resetPasswordEmail_success(testClient):
    existingUser = getExistingUser()
    loginResponse = testClient.post("/login", json=existingUser)
    token = loginResponse.json["accessToken"]
    authHeaders = {"Authorization": f"Bearer {token}"}
    response = testClient.post(
        "/password/reset/request", headers=authHeaders, json=existingUser
    )
    assert (
        response.status_code == 200
        and response.json["message"]
        == "An email has been sent with instructions to reset your password."
    )


def test_resetPasswordBlankEmail_fail(testClient):
    newUser = createNewRandomUser()
    newUser["email"] = ""
    registerResponse = testClient.post("/register", json=newUser)
    token = registerResponse.json["accessToken"]
    authHeaders = {"Authorization": f"Bearer {token}"}
    response = testClient.post(
        "/password/reset/request", headers=authHeaders, json=newUser
    )
    assert (
        response.status_code == 400
        and response.json["message"] == "The email address cannot be missing"
    )


def test_resetPasswordBadEmail_fail(testClient):
    newUser = createNewRandomUser()
    registerResponse = testClient.post("/register", json=newUser)
    token = registerResponse.json["accessToken"]
    authHeaders = {"Authorization": f"Bearer {token}"}
    newUser["email"] = "badEmail@test.com"
    response = testClient.post(
        "/password/reset/request", headers=authHeaders, json=newUser
    )
    assert (
        response.status_code == 404
        and response.json["message"] == "Email not found within our user database."
    )


# endregion


# region Questions tests


def test_generateQuestionPython_success(testClient):
    data = {"category": "Python", "difficulty": "Easy", "type": "Coding"}
    response = ""
    try:
        response = testClient.post("/questions/generate", json=data)
    except:
        # try it one more time
        response = testClient.post("/questions/generate", json=data)
    assert response.status_code == 200 and response.json != None


def test_generateQuestionJavaScript_success(testClient):
    data = {"category": "Javascript", "difficulty": "Hard", "type": "Theoretical"}
    response = testClient.post("/questions/generate", json=data)
    assert response.status_code == 200 and response.json != None


def test_generateQuestionNoCategory_fail(testClient):
    data = {"difficulty": "Hard", "type": "Theoretical"}
    response = testClient.post("/questions/generate", json=data)
    assert (
        response.status_code == 400
        and response.json["message"]
        == "The category, difficulty, or type for the question cannot be missing"
    )


def test_saveQuestionNoAnswers_success(testClient):
    existingUser = getExistingUser()
    loginResponse = testClient.post("/login", json=existingUser)
    token = loginResponse.json["accessToken"]
    authHeaders = {"Authorization": f"Bearer {token}"}
    data = {"category": "C#", "difficulty": "Hard", "type": "Coding"}
    newQuestionResponse = testClient.post("/questions/generate", json=data)
    assert newQuestionResponse.status_code == 200
    saveQuestionResponse = testClient.post(
        "/questions/save", headers=authHeaders, json=newQuestionResponse.json
    )
    assert saveQuestionResponse.status_code == 201


def test_saveQuestionWithAnswers_success(testClient):
    existingUser = getExistingUser()
    loginResponse = testClient.post("/login", json=existingUser)
    token = loginResponse.json["accessToken"]
    authHeaders = {"Authorization": f"Bearer {token}"}
    data = {"category": "Ruby On Rails", "difficulty": "Hard", "type": "Coding"}
    newQuestionResponse = testClient.post("/questions/generate", json=data)
    assert newQuestionResponse.status_code == 200
    newQuestionResponse.json["userAnswer"] = "new user answer"
    newQuestionResponse.json["analyzedAnswer"] = "new AI analyzed answer"
    newQuestionResponse.json["notes"] = "new notes"

    saveQuestionResponse = testClient.post(
        "/questions/save", headers=authHeaders, json=newQuestionResponse.json
    )
    assert saveQuestionResponse.status_code == 201


def test_saveQuestion_fail(testClient):
    data = {"category": "Angular", "difficulty": "Intermediate", "type": "Theoretical"}
    newQuestionResponse = testClient.post("/questions/generate", json=data)
    assert newQuestionResponse.status_code == 200
    saveQuestionResponse = testClient.post(
        "/questions/save", json=newQuestionResponse.json
    )
    assert saveQuestionResponse.status_code == 401


def test_getQuestions_success(testClient):
    newUser = createNewRandomUser()
    loginResponse = testClient.post("/register", json=newUser)
    token = loginResponse.json["accessToken"]
    authHeaders = {"Authorization": f"Bearer {token}"}

    data = {
        "category": "Machine Learning",
        "difficulty": "Intermediate",
        "type": "Theoretical",
    }
    newQuestionResponse = testClient.post("/questions/generate", json=data)
    saveQuestionResponse = testClient.post(
        "/questions/save", headers=authHeaders, json=newQuestionResponse.json
    )

    response = testClient.get("/questions", headers=authHeaders)
    assert response.status_code == 200 and response.json != None


def test_getQuestions_fail(testClient):
    newUser = createNewRandomUser()
    loginResponse = testClient.post("/register", json=newUser)
    token = loginResponse.json["accessToken"]
    authHeaders = {"Authorization": f"Bearer {token}"}

    response = testClient.get("/questions", headers=authHeaders)
    assert (
        response.status_code == 404
        and response.json["message"] == "Questions for user were not found"
    )


def test_getQuestions_success(testClient):
    newUser = createNewRandomUser()
    loginResponse = testClient.post("/register", json=newUser)
    token = loginResponse.json["accessToken"]
    authHeaders = {"Authorization": f"Bearer {token}"}

    data = {
        "category": "Machine Learning",
        "difficulty": "Intermediate",
        "type": "Theoretical",
    }
    newQuestionResponse = testClient.post("/questions/generate", json=data)
    saveQuestionResponse = testClient.post(
        "/questions/save", headers=authHeaders, json=newQuestionResponse.json
    )

    response = testClient.get("/questions", headers=authHeaders)
    assert response.status_code == 200 and response.json != None


def test_questionId_success(testClient):
    newUser = createNewRandomUser()
    loginResponse = testClient.post("/register", json=newUser)
    token = loginResponse.json["accessToken"]
    authHeaders = {"Authorization": f"Bearer {token}"}

    questionsToTest = [
        {"category": "Python", "difficulty": "Hard", "type": "Theoretical"},
        {"category": "Java", "difficulty": "Easy", "type": "Coding"},
    ]

    savedQuestions = []

    for question in questionsToTest:
        genResponse = testClient.post("/questions/generate", json=question)
        assert genResponse.status_code == 200

        saveResponse = testClient.post(
            "/questions/save", headers=authHeaders, json=genResponse.json
        )

        assert saveResponse.status_code == 201
        savedQuestions.append(saveResponse.json)

    questionId = savedQuestions[1]["question"]["id"]
    response = testClient.get(f"/questions/{questionId}", headers=authHeaders)
    assert response.status_code == 200 and response.json != None


def test_questionId_fail(testClient):
    newUser = createNewRandomUser()
    loginResponse = testClient.post("/register", json=newUser)
    token = loginResponse.json["accessToken"]
    authHeaders = {"Authorization": f"Bearer {token}"}

    data = {
        "category": "Python",
        "difficulty": "Hard",
        "type": "Theoretical",
    }
    newQuestionResponse = testClient.post("/questions/generate", json=data)
    saveQuestionResponse = testClient.post(
        "/questions/save", headers=authHeaders, json=newQuestionResponse.json
    )

    response = testClient.get(f"/questions/{1001}", headers=authHeaders)
    assert (
        response.status_code == 404 and response.json["message"] == "No question found."
    )


def test_deleteQuestion_success(testClient):
    newUser = createNewRandomUser()
    loginResponse = testClient.post("/register", json=newUser)
    token = loginResponse.json["accessToken"]
    authHeaders = {"Authorization": f"Bearer {token}"}

    questionsToTest = [
        {"category": "Python", "difficulty": "Hard", "type": "Theoretical"},
        {"category": "Java", "difficulty": "Easy", "type": "Coding"},
    ]

    savedQuestions = []

    for question in questionsToTest:
        genResponse = testClient.post("/questions/generate", json=question)
        assert genResponse.status_code == 200

        saveResponse = testClient.post(
            "/questions/save", headers=authHeaders, json=genResponse.json
        )

        assert saveResponse.status_code == 201
        savedQuestions.append(saveResponse.json)

    questionId = savedQuestions[0]["question"]["id"]
    response = testClient.delete(f"/questions/{questionId}", headers=authHeaders)
    assert (
        response.status_code == 200
        and response.json["message"] == "Question has been deleted"
    )


def test_deleteQuestion_fail(testClient):
    newUser = createNewRandomUser()
    loginResponse = testClient.post("/register", json=newUser)
    token = loginResponse.json["accessToken"]
    authHeaders = {"Authorization": f"Bearer {token}"}

    deleteResponse = testClient.delete(f"/questions/{1001}", headers=authHeaders)
    assert (
        deleteResponse.status_code == 404
        and deleteResponse.json["message"] == "No question found."
    )


# endregion


# region Helper functions
def createNewRandomUser():
    randomNumber = time.time()
    newUser = {
        "username": f"username{randomNumber}",
        "password": f"password{randomNumber}",
        "email": f"email{randomNumber}@test.com",
    }
    return newUser


def getExistingUser():
    return {
        "username": "testUser",
        "password": "testUserPassword",
        "email": "codelingo.help@gmail.com",
    }


# endregion
