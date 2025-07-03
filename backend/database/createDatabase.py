import sqlite3
import os 

base_path = os.path.dirname(__file__)
db_path = os.path.join(base_path, "codeLingoDatabase.db")

db = sqlite3.connect(db_path)
cursor = db.cursor()

schema_path = os.path.join(base_path, "schema.sql")

with open(schema_path) as file: 
    commands = file.read()
    cursor.executescript(commands)

userList = [
    ("username1", "password1"), 
    ("username2", "password2"), 
    ("username3", "password3"), 
]

try:
    cursor.executemany("INSERT into user(username, password) values (?, ?)", userList)
    db.commit()
except sqlite3.Error as e: 
    db.rollback()
    print("error")
finally: 
    db.close()