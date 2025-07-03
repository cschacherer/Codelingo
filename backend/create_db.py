from app import app, db

#create the database
with app.app_context(): 
    db.create_all()
