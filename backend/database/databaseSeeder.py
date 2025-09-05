from database.models import User
from database.models import SavedQuestion
from database.dbConfig import db


class DatabaseSeeder:
    @staticmethod
    def seed():
        # only seed with new data if the database does not exist
        userRecords = User.query.all()
        if len(userRecords) == 0:
            users = [
                User(
                    username="admin",
                    plainTextPassword="admin123",
                    email="connerschacherer@gmail.com",
                ),
                User(
                    username="guest",
                    plainTextPassword="guest123",
                    email="guestEmail@gmail.com",
                ),
                User(
                    username="testUser",
                    plainTextPassword="testUserPassword",
                    email="codelingo.help@gmail.com",
                ),
                User(
                    username="alice",
                    plainTextPassword="alicePass",
                    email="alice@gmail.com",
                ),
                User(
                    username="bob",
                    plainTextPassword="bobPass",
                    email="bob@gmail.com",
                ),
                User(
                    username="carly",
                    plainTextPassword="carlyPass",
                    email="carly@gmail.com",
                ),
            ]
            db.session.add_all(users)
            db.session.commit()
            print("adding new users to empty database")

        questionRecords = SavedQuestion.query.all()
        if len(questionRecords) == 0:
            questions = [
                SavedQuestion(
                    category="Python",
                    difficulty="Hard",
                    type="Theoretical",
                    question="python hard question",
                    answer="correct chatgpt answer",
                    userAnswer="user answer",
                    notes="this is a note",
                    analyzedAnswer="",
                    userId=1,
                ),
                SavedQuestion(
                    category="Java",
                    difficulty="Easy",
                    type="Theoretical",
                    question="java easy question",
                    answer="correct chatgpt answer",
                    userAnswer="user answer",
                    notes="this is a note for question 2",
                    analyzedAnswer="test filling analyzed answer value in",
                    userId=1,
                ),
            ]

            db.session.add_all(questions)
            db.session.commit()
