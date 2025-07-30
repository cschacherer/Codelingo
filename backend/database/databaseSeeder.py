from database.models import User
from database.models import SavedQuestion
from database.dbConfig import db

class DatabaseSeeder(): 
    @staticmethod
    def seed():
        #only seed with new data if the database does not exist 
        userRecords = User.query.all()
        if len(userRecords) == 0: 
            users = [
                User(username="admin", plainTextPassword="admin123"),
                User(username="guest", plainTextPassword="guest123"),
                User(username="alice", plainTextPassword="alicePass"),
                User(username="bob", plainTextPassword="bobPass"),
                User(username="carly", plainTextPassword="carlyPass"),
            ]
            db.session.add_all(users)
            db.session.commit()
            print("adding new users to empty database")

        questionRecords = SavedQuestion.query.all()
        if len(questionRecords) == 0: 
            questions = [
                SavedQuestion(category='Python', difficulty='Hard', type='Theoretical', question='python hard question', answer='correct chatgpt answer', 
                           userAnswer='user answer', notes='this is a note', userId=1), 
                SavedQuestion(category='Java', difficulty='Easy', type='Theoretical', question='java easy question', answer='correct chatgpt answer', 
                           userAnswer='user answer', notes='this is a note for question 2', userId=1),
            ]
                
            db.session.add_all(questions)
            db.session.commit()

