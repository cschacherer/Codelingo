from database.dbConfig import db
from dataclasses import dataclass
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

@dataclass
class User(db.Model, UserMixin):
    __tablename__ = "users"
    id:int = db.Column(db.Integer, primary_key=True)
    username:str = db.Column(db.String(80), unique=True, nullable=False)
    password:str = db.Column(db.String(120), nullable=False)

    def __init__(self, username, plainTextPassword):
        self.username = username
        self.password = generate_password_hash(plainTextPassword)

    def checkPassword(self, plainTextPassword): 
        return check_password_hash(self.password, plainTextPassword)

@dataclass
class SavedQuestion(db.Model): 
    __tablename__ = "savedQuestions"
    id:int = db.Column(db.Integer, primary_key = True)
    category:str = db.Column(db.String(50), nullable=False)
    difficulty:str = db.Column(db.String(50), nullable=False)
    type:str = db.Column(db.String(50), nullable=False)
    question:str = db.Column(db.String, nullable=False)
    answer:str = db.Column(db.String)
    userAnswer:str = db.Column(db.String)
    notes:str = db.Column(db.String)
    userId:int = db.Column(db.Integer, db.ForeignKey('users.id'))