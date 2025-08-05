# Importing flask module in the project is mandatory
# An object of Flask class is our WSGI application.
from flask import (
    Flask,
    send_from_directory,
    jsonify,
    request,
    render_template,
    abort,
    redirect,
    url_for,
)
from LLMs.groq_LLM import Groq_LLM
from LLMs.openAI_LLM import openAI_LLM
import json
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required,
    get_jwt_identity,
    create_refresh_token,
)
from config import Config
from database.dbConfig import DatabaseConfig, db
from database.models import User
from database.models import SavedQuestion
from database.databaseSeeder import DatabaseSeeder
from dotenv import load_dotenv
from datetime import timedelta
import os


def createApp(testing=False):

    app = Flask(__name__)
    CORS(app, supports_credentials=True)

    app.config.from_object(Config)

    # testing
    if testing:
        app.config["TESTING"] = True
        app.config["SQLALCHEMY_DATABASE_URI"] = app.config[
            "TESTING_SQLALCHEMY_DATABASE_URI"
        ]

    load_dotenv()
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")

    # database management
    DatabaseConfig(app)
    with app.app_context():
        db.create_all()
        DatabaseSeeder.seed()

    # token management
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
    app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(weeks=1)
    jwt = JWTManager(app)

    # LLM management
    useOpenAI = False
    if useOpenAI:
        communicator = openAI_LLM()
    else:
        communicator = Groq_LLM()

    # The route() function of the Flask class is a decorator,
    # which tells the application which URL should call
    # the associated function.
    @app.route("/")
    def homePage():
        category = "Python"
        difficulty = "Hard"
        type = "Coding"
        response = communicator.generateQuestion(category, difficulty, type)
        return (
            jsonify(
                category=category,
                difficulty=difficulty,
                type=type,
                question=response,
            ),
            200,
        )

    @app.route("/generate_question", methods=["POST"])
    def generateQuestion():
        data = request.get_json()
        category = data.get("category")
        difficulty = data.get("difficulty")
        type = data.get("type")
        questionData = communicator.generateQuestion(category, difficulty, type)
        parsedJsonData = json.loads(questionData)

        # Handle case-insensitive keys safely
        keys_lower = {k.lower(): v for k, v in parsedJsonData.items()}
        question = (
            keys_lower.get("question")
            or f"Error parsing the question from the LLM response. {parsedJsonData}"
        )
        answer = (
            keys_lower.get("answer")
            or f"Error parsing the answer from the LLM response. {parsedJsonData}"
        )

        return (
            jsonify(
                category=category,
                difficulty=difficulty,
                type=type,
                question=question,
                answer=answer,
            ),
            200,
        )

    @app.route("/login", methods=["POST"])
    def login():
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")
        if username == None or password == None:
            return jsonify(message="Username or password cannot be missing"), 400

        user = User.query.filter_by(username=username).first()
        if user:
            if user.checkPassword(password):
                accessToken = create_access_token(str(user.id))
                refreshToken = create_refresh_token(str(user.id))
                return (
                    jsonify(
                        message="Logged in user",
                        accessToken=accessToken,
                        refreshToken=refreshToken,
                    ),
                    200,
                )
            else:
                return jsonify(message="Invalid username or password"), 401
        else:
            return jsonify(message="Invalid username or password"), 401

    @app.route("/register", methods=["POST"])
    def register():
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")
        email = data.get("email")
        if username == None or password == None:
            return jsonify(message="Username or password cannot be missing"), 400
        existingUser = User.query.filter_by(username=username).first()
        if existingUser:
            return jsonify(message="User with that username already exists"), 400
        user = User(username=username, plainTextPassword=password, email=email)
        db.session.add(user)
        db.session.commit()

        accessToken = create_access_token(str(user.id))
        refreshToken = create_refresh_token(str(user.id))
        return (
            jsonify(
                message="Registered user",
                accessToken=accessToken,
                refreshToken=refreshToken,
            ),
            200,
        )

    @app.route("/refresh", methods=["POST"])
    @jwt_required(refresh=True)
    def refreshAccessToken():
        currentUserId = get_jwt_identity()
        newAccessToken = create_access_token(str(currentUserId))
        return jsonify(accessToken=newAccessToken)

    @app.route("/users", methods=["GET"])
    @jwt_required()
    def getAllUsers():
        users = User.query.all()
        if len(users) == 0:
            return jsonify(message="No users found"), 404
        return jsonify(users=[user.to_dict() for user in users]), 200

    @app.route("/user", methods=["GET"])
    @jwt_required()
    def getUser():
        currentUserId = get_jwt_identity()
        user = User.query.filter_by(id=currentUserId).first()
        if not user:
            return jsonify(message="User not found"), 404
        questions = SavedQuestion.query.filter_by(userId=user.id).all()
        userData = {}

        return (
            jsonify(
                username=user.username,
                email=user.email,
                savedQuestions=[q.to_dict() for q in questions],
            ),
            200,
        )

    @app.route("/user", methods=["PATCH"])
    @jwt_required()
    def updateUser():
        currentUserId = get_jwt_identity()
        user = User.query.filter_by(id=currentUserId).first()
        if not user:
            return jsonify(message="User not found"), 404

        data = request.get_json()
        newUsername = data.get("username")
        newPassword = data.get("password")
        newEmail = data.get("email")

        if newUsername:
            user.username = newUsername
        if newPassword:
            user.password = newPassword
        if newEmail:
            user.email = newEmail
        db.session.commit()
        return jsonify(user=user.to_dict()), 200

    @app.route("/user", methods=["DELETE"])
    @jwt_required()
    def deleteUser():
        currentUserId = get_jwt_identity()

        user = User.query.filter_by(id=currentUserId).first()
        if not user:
            return jsonify(message="User not found"), 404

        db.session.delete(user)
        db.session.commit()
        newUsers = User.query.all()
        return jsonify(users=[user.to_dict() for user in newUsers]), 200

    @app.route("/questions", methods=["POST"])
    @jwt_required()
    def saveQuestion():
        currentUserId = get_jwt_identity()
        user = User.query.filter_by(id=currentUserId).first()
        if not user:
            return jsonify(message="User not found"), 404
        data = request.get_json()
        question = SavedQuestion(
            category=data.get("category"),
            difficulty=data.get("difficulty"),
            type=data.get("type"),
            question=data.get("question"),
            answer=data.get("answer"),
            userAnswer=data.get("userAnswer"),
            notes=data.get("notes"),
            userId=currentUserId,
        )
        db.session.add(question)
        db.session.commit()
        return jsonify(question=question.to_dict()), 201

    @app.route("/questions", methods=["GET"])
    @jwt_required()
    def getAllQuestions():
        currentUserId = get_jwt_identity()
        questions = SavedQuestion.query.filter_by(userId=currentUserId).all()
        if not questions:
            return jsonify(message=f"Questions for user were not found"), 404
        return jsonify(question=[q.to_dict() for q in questions]), 200

    @app.route("/questions/<questionId>", methods=["GET"])
    @jwt_required()
    def loadQuestion(questionId):
        currentUserId = get_jwt_identity()
        question = SavedQuestion.query.filter_by(
            userId=currentUserId,
            id=questionId,
        ).first()
        if not question:
            return jsonify(message="No question found."), 404
        return jsonify(question=question.to_dict()), 200

    return app


# main driver function
if __name__ == "__main__":
    # run() method of Flask class runs the application
    # on the local development server.
    app = createApp()
    app.run(debug=True)
