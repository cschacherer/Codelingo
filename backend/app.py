# Importing flask module in the project is mandatory
# An object of Flask class is our WSGI application.
from flask import Flask, send_from_directory, jsonify, request, render_template
from groq_LLM import Groq_LLM
from openAI_LLM import openAI_LLM
import json
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Resource, Api, reqparse, fields, marshal_with, abort


# Flask constructor takes the name of 
# current module (__name__) as argument.
app = Flask(__name__)
# app = Flask(__name__, static_folder="../frontend/dist", static_url_path="/")

app.config['SECRET_KEY'] = 'secretivekey'

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
db = SQLAlchemy(app)

api = Api(app) 


class UserModel(db.Model): 
    id = db.Column(db.Integer, primary_key = True)
    username = db.Column(db.String(20), nullable=False, unique=True)
    password = db.Column(db.String(80), nullable=False)

    def __repr__(self): 
        return f"User(username = {self.username}, password = {self.password})"

userArgs = reqparse.RequestParser()
userArgs.add_argument('username', type=str, required=True, help="Username cannot be blank")
userArgs.add_argument('password', type=str, required=True, help="Password cannot be blank")

userFields = {
    'id': fields.Integer, 
    'username': fields.String, 
    'password': fields.String,
}

class Users(Resource): 
    @marshal_with(userFields)
    def get(self): 
        users = UserModel.query.all()
        return users 
    
    @marshal_with(userFields)
    def post(self):
        args = userArgs.parse_args()
        user = UserModel(username=args["username"], password=args["password"])
        db.session.add(user)
        db.session.commit()
        users = UserModel.query.all()
        return users, 201
    

class User(Resource):
    @marshal_with(userFields)
    def get(self, username): 
        user = UserModel.query.filter_by(username=username).first()
        if not user: 
            abort(404, "User not found")
        return user
    
    @marshal_with(userFields)
    def patch(self, username): 
        args = userArgs.parse_args()
        user = UserModel.query.filter_by(username=username).first()
        if not user: 
            abort(404, "User not found")
        user.username = args["username"]
        user.password = args["password"]
        db.session.commit()
        return user
    
    @marshal_with(userFields)
    def delete(self, username): 
        user = UserModel.query.filter_by(username=username).first()
        if not user: 
            abort(404, "User not found")
        
        db.session.delete(user)
        db.session.commit()

        newUsers = UserModel.query.all()
        return newUsers
    

    
api.add_resource(Users, '/api/users/')
api.add_resource(User, '/api/users/<string:username>')


useOpenAI = False
if(useOpenAI): 
    communicator = openAI_LLM()
else:
    communicator = Groq_LLM() 

# The route() function of the Flask class is a decorator, 
# which tells the application which URL should call 
# the associated function.
# ‘/’ URL is bound with hello_world() function.

# @app.route('/')
# def homePage():
#     #return send_from_directory(app.static_folder, "index.html")
#     category = "Python"
#     difficulty = "Hard"
#     type = "Coding"
#     response = communicator.generateQuestion(category, difficulty, type)
#     return response

@app.route('/generate_question', methods=['GET'])
def generateQuestion():
    #return send_from_directory(app.static_folder, "index.html")
    category = request.args.get('category')
    difficulty = request.args.get('difficulty')
    type = request.args.get('type')
    response = communicator.generateQuestion(category, difficulty, type)
    return response


@app.route('/')
def login():
    return render_template('login.html')

@app.route('/register')
def register():
    return render_template('register.html')


# main driver function
if __name__ == '__main__':
    # run() method of Flask class runs the application 
    # on the local development server.
    app.run(debug=True)
    

