# Importing flask module in the project is mandatory
# An object of Flask class is our WSGI application.
from flask import Flask, send_from_directory, jsonify, request
from groq_LLM import Groq_LLM
from openAI_LLM import openAI_LLM
import json
from flask_cors import CORS

# Flask constructor takes the name of 
# current module (__name__) as argument.
app = Flask(__name__, static_folder="../frontend/dist", static_url_path="/")
CORS(app)

useOpenAI = False
if(useOpenAI): 
    communicator = openAI_LLM()
else:
    communicator = Groq_LLM() 

# The route() function of the Flask class is a decorator, 
# which tells the application which URL should call f
# # the associated function.
# @app.route('/')
# # ‘/’ URL is bound with hello_world() function.
# def hello_world():
#     return 'Hello 5'

# The route() function of the Flask class is a decorator, 
# which tells the application which URL should call 
# the associated function.
# ‘/’ URL is bound with hello_world() function.
@app.route('/login')
def login():
    return 'Logging in...'

@app.route('/')
def homePage():
    #return send_from_directory(app.static_folder, "index.html")
    category = "Python"
    difficulty = "Hard"
    type = "Coding"
    response = communicator.generateQuestion(category, difficulty, type)
    return response

@app.route('/generate_question', methods=['GET'])
def generateQuestion():
    #return send_from_directory(app.static_folder, "index.html")
    category = request.args.get('category')
    difficulty = request.args.get('difficulty')
    type = request.args.get('type')
    response = communicator.generateQuestion(category, difficulty, type)
    return response

# main driver function
if __name__ == '__main__':

    # run() method of Flask class runs the application 
    # on the local development server.
    app.run(debug=True)
