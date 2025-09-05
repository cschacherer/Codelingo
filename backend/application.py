# Importing flask module in the project is mandatory
# An object of Flask class is our WSGI application.
import os
import json
from flask import Flask, jsonify, request, url_for
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
from database.dbConfig import DatabaseConfig, db
from database.models import User
from database.models import SavedQuestion
from database.databaseSeeder import DatabaseSeeder
from dotenv import load_dotenv
from datetime import timedelta
from itsdangerous.url_safe import URLSafeTimedSerializer
from flask_mail import Mail, Message


def createApp(testing=False):

    application = Flask(__name__)
    CORS(
        application,
        supports_credentials=True,
        resources={
            r"/*": {
                "origins": [
                    "http://localhost:3000",  # local dev
                    "http://codelingo-ai.com",  # your deployed frontend
                    "https://codelingo-ai.com",
                    "http://codelingo.us-east-2.elasticbeanstalk.com",  # elastic beanstalk frontend
                ]
            }
        },
    )

    # region Environment Variables Configuration
    load_dotenv()
    application.config["SECRET_KEY"] = os.getenv("SECRET_KEY")

    application.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("SQLALCHEMY_DATABASE_URI")

    # testing
    if testing:
        application.config["TESTING"] = True
        application.config["SQLALCHEMY_DATABASE_URI"] = os.getenv(
            "TESTING_SQLALCHEMY_DATABASE_URI"
        )
        testingDatabaseFilePath = application.config["SQLALCHEMY_DATABASE_URI"].replace(
            "sqlite:///", ""
        )
        if os.path.exists(testingDatabaseFilePath):
            os.remove(testingDatabaseFilePath)

    # database management
    DatabaseConfig(application)
    with application.app_context():
        db.create_all()
        DatabaseSeeder.seed()

    # token management
    application.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
    application.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
    application.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(weeks=1)
    jwt = JWTManager(application)

    # mail
    application.config["MAIL_SERVER"] = "smtp.gmail.com"
    application.config["MAIL_PORT"] = 587
    application.config["MAIL_USE_TLS"] = True
    application.config["MAIL_USE_SSL"] = False
    application.config["MAIL_USERNAME"] = os.environ.get("CODELINGO_EMAIL_ADDRESS")
    application.config["MAIL_PASSWORD"] = os.environ.get("CODELINGO_EMAIL_PASSWORD")
    application.config["MAIL_DEFAULT_SENDER"] = os.environ.get(
        "CODELINGO_EMAIL_ADDRESS"
    )
    mail = Mail(application)

    # LLM management
    useOpenAI = True
    if useOpenAI:
        communicator = openAI_LLM()
    else:
        communicator = Groq_LLM()

    # endregion

    # region Login and Register Functions

    @application.route("/login", methods=["POST"])
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

    @application.route("/register", methods=["POST"])
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

        if not email:
            email = ""
        if email != "":
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

    @application.route("/token/refresh", methods=["POST"])
    @jwt_required(refresh=True)
    def refreshAccessToken():
        currentUserId = get_jwt_identity()
        newAccessToken = create_access_token(str(currentUserId))
        if newAccessToken:
            return jsonify(accessToken=newAccessToken)
        return jsonify(message="Invalid user or token"), 400

    # endregion

    # region User Functions

    # need to add admin functionality before allowing /users
    # @application.route("/users", methods=["GET"])
    # @jwt_required()
    # def getAllUsers():
    #     users = User.query.all()
    #     if not users:
    #         return jsonify(message="No users found"), 404
    #     return jsonify(users=[user.to_dict() for user in users]), 200

    @application.route("/user", methods=["GET"])
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

    @application.route("/user", methods=["PATCH"])
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

    @application.route("/user", methods=["DELETE"])
    @jwt_required()
    def deleteUser():
        currentUserId = get_jwt_identity()

        user = User.query.filter_by(id=currentUserId).first()
        if not user:
            return jsonify(message="User not found"), 404

        db.session.delete(user)
        db.session.commit()
        newUsers = User.query.all()
        return jsonify(message="User deleted"), 200

    # endregion

    # region Reset Password Functions
    def getResetToken(email):
        serializer = URLSafeTimedSerializer(application.config["SECRET_KEY"])
        return serializer.dumps({"email": email})

    def verifyResetToken(
        token, expiration=1800
    ):  # 1800 seconds means it expires after 30 minutes
        serializer = URLSafeTimedSerializer(application.config["SECRET_KEY"])
        data = serializer.loads(token, max_age=expiration)
        email = data["email"]
        return email

    @application.route("/password/reset/request", methods=["POST"])
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

            resetLink = url_for("resetPassword", token=token, _external=True)

            msg = Message(
                "CodeLingo Reset Password",
                recipients=[recipientEmail],
                sender=application.config["MAIL_DEFAULT_SENDER"],
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

    @application.route("/password/reset", methods=["POST"])
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
    @application.route("/questions", methods=["GET"])
    @jwt_required()
    def getAllQuestions():
        currentUserId = get_jwt_identity()
        questions = SavedQuestion.query.filter_by(userId=currentUserId).all()
        if not questions:
            return jsonify(message=f"Questions for user were not found"), 404
        return jsonify(question=[q.to_dict() for q in questions]), 200

    @application.route("/questions/generate", methods=["POST"])
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

    @application.route("/questions/analyze", methods=["POST"])
    def analyzeUserAnswer():
        try:
            data = request.get_json()
            category = data.get("category")
            question = data.get("question")
            officialAnswer = data.get("answer")
            userAnswer = data.get("userAnswer")
            if not category or not question or not officialAnswer or not userAnswer:
                return (
                    jsonify(
                        message="The category, question, official answer, or userAnswer for the question cannot be missing"
                    ),
                    400,
                )
            analyzedAnswer = communicator.analyzeAnswer(
                category, question, officialAnswer, userAnswer
            )

            return (
                jsonify(
                    analyzedAnswer=analyzedAnswer,
                ),
                200,
            )
        except Exception as e:
            return jsonify(message=e)

    @application.route("/questions/save", methods=["POST"])
    @jwt_required()
    def saveQuestion():
        currentUserId = get_jwt_identity()
        user = User.query.filter_by(id=currentUserId).first()
        if not user:
            return jsonify(message="User not found"), 404
        data = request.get_json()

        # if id already exists, override the answers
        id = data.get("id")
        existingQuestion = SavedQuestion.query.filter_by(id=id).first()
        if existingQuestion:
            userAnswer = data.get("userAnswer")
            notes = data.get("notes")
            analyzedAnswer = data.get("analyzedAnswer")
            existingQuestion.updateQuestion(userAnswer, notes, analyzedAnswer)
            db.session.commit()
            return jsonify(question=existingQuestion.to_dict()), 201

        # question is new
        question = SavedQuestion(
            category=data.get("category"),
            difficulty=data.get("difficulty"),
            type=data.get("type"),
            question=data.get("question"),
            answer=data.get("answer"),
            userAnswer=data.get("userAnswer"),
            notes=data.get("notes"),
            analyzedAnswer=data.get("analyzedAnswer"),
            userId=currentUserId,
        )
        db.session.add(question)
        db.session.commit()
        return jsonify(question=question.to_dict()), 201

    @application.route("/questions/<questionId>", methods=["GET"])
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

    @application.route("/questions/<questionId>", methods=["DELETE"])
    @jwt_required()
    def deleteQuestion(questionId):
        currentUserId = get_jwt_identity()
        question = SavedQuestion.query.filter_by(
            userId=currentUserId,
            id=questionId,
        ).first()
        if not question:
            return jsonify(message="No question found."), 404
        db.session.delete(question)
        db.session.commit()
        return jsonify(message="Question has been deleted"), 200

    # endregion

    # Health check path for EB load balancer
    @application.route("/health")
    def health_check():
        return "OK", 200

    return application


application = createApp()

# main driver function
if __name__ == "__main__":
    # run() method of Flask class runs the application
    # on the local development server.
    application.run(debug=True)
