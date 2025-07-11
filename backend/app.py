# Importing flask module in the project is mandatory
# An object of Flask class is our WSGI application.
from flask import Flask, send_from_directory, jsonify, request, render_template, abort, redirect, url_for
from LLMs.groq_LLM import Groq_LLM
from LLMs.openAI_LLM import openAI_LLM
import json
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from config import Config
from database.dbConfig import DatabaseConfig, db
from database.models import User
from database.models import SavedQuestion
from database.databaseSeeder import DatabaseSeeder
from flask_login import login_user, LoginManager, login_required, logout_user, current_user
from dotenv import load_dotenv
import os 


def createApp(testing = False): 

    app = Flask(__name__)
    CORS(app)

    app.config.from_object(Config)

    if testing: 
        app.config['TESTING'] = True 
        app.config["SQLALCHEMY_DATABASE_URI"] = app.config["TESTING_SQLALCHEMY_DATABASE_URI"]

    load_dotenv()
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")

    DatabaseConfig(app)
    
    with app.app_context(): 
        db.create_all()
        DatabaseSeeder.seed()

    loginManager = LoginManager()
    loginManager.init_app(app)
    loginManager.login_view = "login"
        
    useOpenAI = False
    if(useOpenAI): 
        communicator = openAI_LLM()
    else:
        communicator = Groq_LLM() 

    #resets the current user 
    @loginManager.user_loader
    def loadUser(userId): 
        return User.query.get(int(userId))    
    
    @app.route('/dashboard', methods=['GET', 'POST'])
    @login_required
    def dashboard(): 
        return jsonify({"msg": "this is your dashboard"}), 200

    # The route() function of the Flask class is a decorator, 
    # which tells the application which URL should call 
    # the associated function.
    @app.route('/')
    def homePage():
        category = "Python"
        difficulty = "Hard"
        type = "Coding"
        response = communicator.generateQuestion(category, difficulty, type)
        return jsonify({
            "category": category, 
            "difficulty": difficulty, 
            "type": type, 
            "question": response
        }), 200

    @app.route('/generate_question', methods=['POST'])
    def generateQuestion():
        data = request.get_json()
        category = data.get('category')
        difficulty = data.get('difficulty')
        type = data.get('type')
        newQuestion = communicator.generateQuestion(category, difficulty, type)
        jsonNewQuestion = json.loads(newQuestion) 
        return jsonify({
            "category": category, 
            "difficulty": difficulty, 
            "type": type, 
            "question": jsonNewQuestion
        }), 200

    @app.route('/login', methods=['POST'])
    def login():
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        if(username == None or password == None): 
            return jsonify({"msg": "Username or password cannot be missing"}), 400

        user = User.query.filter_by(username=username).first()
        if user: 
            if user.checkPassword(password):
                login_user(user)
                return jsonify({"msg": "Logged in user"}), 200
            else:
                return jsonify({"msg": "Wrong password"}), 400
        
        return jsonify({"msg": "No user with that username exists"}), 404

    @app.route('/logout', methods=['POST'])
    @login_required
    def logout():
        logout_user()
        return {"msg": "Logged out user"}, 200   
        
    @app.route('/register', methods=['POST'])
    def register():
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        if(username == None or password == None): 
            return jsonify({"msg": "Username or password cannot be missing"}), 400
        existingUser = User.query.filter_by(username=username).first()
        if existingUser: 
            return jsonify({"msg": "User with that username already exists"}), 400
        user = User(username=username, plainTextPassword=password)
        db.session.add(user)
        db.session.commit()
        return jsonify({"msg": "Registered user"}), 200

    @app.route('/users', methods=['GET'])
    def getUsers():
        users = User.query.all()
        if len(users) == 0: 
            return jsonify({"msg": "No users found"}), 404
        return jsonify(users), 200

    @app.route('/users/<username>', methods=['GET'])
    def getUser(username): 
        user = User.query.filter_by(username=username).first()
        if not user: 
            return jsonify({"msg": "User not found"}), 404
        return jsonify(user), 200

    @app.route('/users/<username>', methods=['PATCH'])
    def updateUser(username): 
        data = request.get_json()
        newUsername = data.get("username")
        newPassword = data.get("password")
        if(newUsername == None or newPassword == None): 
            return jsonify({"msg": "Username or password cannot be missing"}), 400
        
        user = User.query.filter_by(username=username).first()
        if not user: 
            return jsonify({"msg": "User not found"}), 404
        
        user.username = newUsername
        user.password = newPassword
        db.session.commit()
        return jsonify(user), 200

    @app.route('/users/<username>', methods=['DELETE'])
    def deleteUser(username): 
        if(username == None): 
            return jsonify({"msg": "Username cannot be missing"}), 400
        
        user = User.query.filter_by(username=username).first()
        if not user: 
            return jsonify({"msg": "User not found"}), 404
        
        db.session.delete(user)
        db.session.commit()
        newUsers = User.query.all()
        return jsonify(newUsers), 200
    
    @app.route('/users/<username>/questions', methods=['POST'])
    @login_required
    def saveQuestion(username): 
        data = request.get_json()
        question = SavedQuestion(data.get("category"), 
                                data.get("difficulty"), 
                                data.get("type"), 
                                data.get("question"), 
                                data.get("answer"), 
                                data.get("userAnswer"), 
                                data.get("notes"), 
                                data.get("userId"))
        db.session.add(question)
        db.session.commit()
        return jsonify(question), 201


    @app.route('/users/<username>/questions/<questionId>', methods=['GET'])
    def loadQuestion(username, questionId): 
        data = request.get_json()
        question = SavedQuestion.query.filter_by(userId=username, id=questionId).first()
        if not question: 
            return jsonify({"msg": f"Question for {username} was not found"}), 404
        return jsonify(question), 200
    
    return app


# main driver function
if __name__ == '__main__':
    # run() method of Flask class runs the application 
    # on the local development server.
    app = createApp()
    app.run(debug=True)
    

