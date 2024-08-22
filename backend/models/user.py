import json
import os
from werkzeug.security import check_password_hash, generate_password_hash
from flask_login import UserMixin

class User(UserMixin):
    filepath = 'baza_danych/users.json'

    def __init__(self, username=None, password=None):
        self.username = username
        self.password = password

    def get_id(self):
        return self.username  # Zwraca unikalny identyfikator użytkownika (np. nazwę użytkownika)

    @staticmethod
    def get(username):
        if not os.path.exists(User.filepath):
            return None
        
        try:
            with open(User.filepath, 'r') as f:
                if os.path.getsize(User.filepath) == 0:  # Sprawdź, czy plik jest pusty
                    return None
                
                users = json.load(f)
        except json.JSONDecodeError:
            return None

        user_data = users.get(username)
        if user_data:
            return User(username, user_data['password'])  # Twórz instancję User z odpowiednimi danymi
        return None

    @staticmethod
    def save(username, hashed_password):
        users = {}
        if os.path.exists(User.filepath):
            try:
                with open(User.filepath, 'r') as f:
                    if os.path.getsize(User.filepath) > 0:
                        users = json.load(f)
            except json.JSONDecodeError:
                pass  # Jeśli JSON jest uszkodzony, zostanie utworzony nowy plik

        users[username] = {'password': hashed_password}

        with open(User.filepath, 'w') as f:
            json.dump(users, f, indent=4)
