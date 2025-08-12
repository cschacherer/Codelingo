from database.dbConfig import db
from dataclasses import dataclass
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy import ForeignKey
from itsdangerous import TimedSerializer


@dataclass
class User(db.Model, UserMixin):
    __tablename__ = "users"
    id: int = db.Column(db.Integer, primary_key=True)
    username: str = db.Column(db.String(254), unique=True, nullable=False)
    password: str = db.Column(db.String(254), nullable=False)
    email: str = db.Column(db.String(254), nullable=True)

    def __init__(self, username, plainTextPassword, email):
        self.username = username
        self.password = generate_password_hash(plainTextPassword)
        self.email = email

    def checkPassword(self, plainTextPassword):
        return check_password_hash(self.password, plainTextPassword)

    def changePassword(self, plainTextPassword):
        self.password = generate_password_hash(plainTextPassword)

    # compare values between two questions, except for id
    # used when testing that a question has actually been committed and saved to the database
    def compareValues(self, other):
        if isinstance(other, User):
            return self.username == other.username and self.password == other.password
        return False

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
        }


@dataclass
class SavedQuestion(db.Model):
    __tablename__ = "savedQuestions"
    id: int = db.Column(db.Integer, primary_key=True)
    category: str = db.Column(db.String(50), nullable=False)
    difficulty: str = db.Column(db.String(50), nullable=False)
    type: str = db.Column(db.String(50), nullable=False)
    question: str = db.Column(db.String, nullable=False)
    answer: str = db.Column(db.String, nullable=False)
    userAnswer: str = db.Column(db.String)
    notes: str = db.Column(db.String)
    userId: int = db.Column(db.Integer, ForeignKey("users.id"), nullable=False)

    # compare values between two questions, except for id
    # used when testing that a question has actually been committed and saved to the database
    def compareValues(self, other):
        if isinstance(other, SavedQuestion):
            return (
                self.category == other.category
                and self.difficulty == other.difficulty
                and self.type == other.type
                and self.question == other.question
                and self.answer == other.answer
                and self.userAnswer == other.userAnswer
                and self.notes == other.notes
                and self.userId == other.userId
            )
        return False

    def to_dict(self):
        return {
            "id": self.id,
            "category": self.category,
            "difficulty": self.difficulty,
            "type": self.type,
            "question": self.question,
            "answer": self.answer,
            "userAnswer": self.userAnswer,
            "notes": self.notes,
            "userId": self.userId,
        }

    def updateQuestion(self, newAnswer, newNotes):
        self.userAnswer = newAnswer
        self.notes = newNotes
