# Importing flask module in the project is mandatory
# An object of Flask class is our WSGI application.
import os
import json
from flask import (
    Flask,
    jsonify,
    request,
)
from LLMs.groq_LLM import Groq_LLM
from LLMs.openAI_LLM import openAI_LLM
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
from itsdangerous.url_safe import URLSafeTimedSerializer
from flask_mail import Mail, Message


def createApp(testing=False):

    app = Flask(__name__)
    CORS(app, supports_credentials=True)

    # region Configuration
    app.config.from_object(Config)

    # testing
    if testing:
        app.config["TESTING"] = True
        app.config["SQLALCHEMY_DATABASE_URI"] = app.config[
            "TESTING_SQLALCHEMY_DATABASE_URI"
        ]

    load_dotenv()
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
    app.config["WEBSITE_BASE_URL"] = "http://localhost:5173"

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

    # mail
    app.config["MAIL_SERVER"] = "smtp.gmail.com"
    app.config["MAIL_PORT"] = 587
    app.config["MAIL_USE_TLS"] = True
    app.config["MAIL_USE_SSL"] = False
    app.config["MAIL_USERNAME"] = os.environ.get("CODELINGO_EMAIL_ADDRESS")
    app.config["MAIL_PASSWORD"] = os.environ.get("CODELINGO_EMAIL_PASSWORD")
    app.config["MAIL_DEFAULT_SENDER"] = os.environ.get("CODELINGO_EMAIL_ADDRESS")
    mail = Mail(app)

    # LLM management
    useOpenAI = False
    if useOpenAI:
        communicator = openAI_LLM()
    else:
        communicator = Groq_LLM()

    # endregion

    # region Login and Register Functions

    @app.route("/login", methods=["POST"])
    def login():
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")
        if not username or not password:
            return (
                jsonify(message="Username or password cannot be missing"),
                400,
            )

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
        if not username or not password:
            return jsonify(message="Username or password cannot be missing"), 400
        existingUsername = User.query.filter_by(username=username).first()
        if existingUsername:
            return jsonify(message="User with that username already exists"), 400
        existingEmail = User.query.filter_by(email=email).first()
        if existingEmail:
            return jsonify(message="User with that email already exists"), 400
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

    @app.route("/token/refresh", methods=["POST"])
    @jwt_required(refresh=True)
    def refreshAccessToken():
        currentUserId = get_jwt_identity()
        newAccessToken = create_access_token(str(currentUserId))
        return jsonify(accessToken=newAccessToken)

    # endregion

    # region User Functions

    @app.route("/users", methods=["GET"])
    @jwt_required()
    def getAllUsers():
        users = User.query.all()
        if not users:
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
            user.changePassword(plainTextPassword=newPassword)
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

    # endregion

    # region Reset Password Functions
    def getResetToken(email):
        serializer = URLSafeTimedSerializer(app.config["SECRET_KEY"])
        return serializer.dumps({"email": email})

    def verifyResetToken(
        token, expiration=1800
    ):  # 1800 seconds means it expires after 30 minutes
        serializer = URLSafeTimedSerializer(app.config["SECRET_KEY"])
        data = serializer.loads(token, max_age=expiration)
        email = data["email"]
        return email

    @app.route("/password/reset/request", methods=["POST"])
    def sendRequestResetEmail():
        data = request.get_json()
        recipientEmail = data.get("email")
        if not recipientEmail:
            return jsonify(message="The email address cannot be missing"), 400
        user = User.query.filter_by(email=recipientEmail).first()
        if not user:
            return jsonify(message="Email not found within our user database."), 404

        try:
            token = getResetToken(recipientEmail)

            resetLink = f"{app.config["WEBSITE_BASE_URL"]}/password/reset/{token}"

            msg = Message(
                "CodeLingo Reset Password",
                recipients=[recipientEmail],
                sender=app.config["MAIL_DEFAULT_SENDER"],
            )
            msg.body = f"To reset your password, visit the following link: {resetLink} \n \n If you did not make this request, then ignore this email and no changes will be made."
            mail.send(msg)

        except Exception as e:
            msg = f"Error sending password reset email. {e}"
            return jsonify(message=msg), 400

        return (
            jsonify(
                message="An email has been sent with instructions to reset your password."
            ),
            200,
        )

    @app.route("/password/reset", methods=["POST"])
    def resetPassword():
        data = request.get_json()
        token = data.get("token")
        newPassword = data.get("newPassword")
        if not token or not newPassword:
            return (
                jsonify(
                    message="The password reset token or new password cannot be missing"
                ),
                400,
            )

        try:
            email = verifyResetToken(token)
            if not email:
                return jsonify(message="Invalid or expired token"), 400

            user = User.query.filter_by(email=email).first()
            if not user:
                return (
                    jsonify(message="Email is not associated with any existing user."),
                    404,
                )

            user.changePassword(plainTextPassword=newPassword)
            db.session.commit()
            return jsonify(message="Password updated successfully"), 200
        except Exception as e:
            msg = f"Error resetting password. {e}"
            return jsonify(message=msg), 400

    # endregion

    # region Questions
    @app.route("/questions", methods=["GET"])
    @jwt_required()
    def getAllQuestions():
        currentUserId = get_jwt_identity()
        questions = SavedQuestion.query.filter_by(userId=currentUserId).all()
        if not questions:
            return jsonify(message=f"Questions for user were not found"), 404
        return jsonify(question=[q.to_dict() for q in questions]), 200

    @app.route("/questions/generate", methods=["POST"])
    def generateQuestion():
        try:
            data = request.get_json()
            category = data.get("category")
            difficulty = data.get("difficulty")
            type = data.get("type")
            if not category or not difficulty or not type:
                return (
                    jsonify(
                        message="The category, difficulty, or type for the question cannot be missing"
                    ),
                    400,
                )
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
        except Exception as e:
            return jsonify(message=e)

    @app.route("/questions/save", methods=["POST"])
    @jwt_required()
    def saveQuestion():
        currentUserId = get_jwt_identity()
        user = User.query.filter_by(id=currentUserId).first()
        if not user:
            return jsonify(message="User not found"), 404
        data = request.get_json()

        # if id already exists, delete it to override saving an existing question
        id = data.get("id")
        if id != -1:
            db.session.delete(id=id)

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

    # endregion

    return app


# main driver function
if __name__ == "__main__":
    # run() method of Flask class runs the application
    # on the local development server.
    app = createApp()
    app.run(debug=True)
