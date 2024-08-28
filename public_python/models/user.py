import json
import os
import uuid
from werkzeug.security import check_password_hash, generate_password_hash
from flask_login import UserMixin

class User(UserMixin):
    filepath = 'baza_danych/users.json'

    def __init__(self, uuid=None, username=None, password=None):
        self.uuid = uuid or str(uuid.uuid4())  # Generate UUID if not provided
        self.username = username
        self.password = password

    def get_id(self):
        return self.uuid  # Return the UUID as the unique identifier

    @staticmethod
    def get_by_username(username):
        """Find a user by username."""
        if not os.path.exists(User.filepath):
            return None

        try:
            with open(User.filepath, 'r') as f:
                if os.path.getsize(User.filepath) == 0:
                    return None
                
                users = json.load(f)
        except json.JSONDecodeError:
            return None

        for uuid, user_data in users.items():
            if user_data['username'] == username:
                return User(uuid, username, user_data['password'])

        return None

    @staticmethod
    def get_by_uuid(uuid):
        """Find a user by UUID."""
        if not os.path.exists(User.filepath):
            return None

        try:
            with open(User.filepath, 'r') as f:
                if os.path.getsize(User.filepath) == 0:
                    return None
                
                users = json.load(f)
        except json.JSONDecodeError:
            return None

        user_data = users.get(uuid)
        if user_data:
            return User(uuid, user_data['username'], user_data['password'])
        
        return None

    @staticmethod
    def save(username, hashed_password):
        users = {}
        uuid_str = str(uuid.uuid4())

        if os.path.exists(User.filepath):
            try:
                with open(User.filepath, 'r') as f:
                    if os.path.getsize(User.filepath) > 0:
                        users = json.load(f)
            except json.JSONDecodeError:
                pass  # Jeśli JSON jest uszkodzony, zostanie utworzony nowy plik

        users[uuid_str] = {'username': username, 'password': hashed_password}

        with open(User.filepath, 'w') as f:
            json.dump(users, f, indent=4)

        return uuid_str

    @staticmethod
    def delete(uuid):
        """Delete a user by UUID."""
        if os.path.exists(User.filepath):
            try:
                with open(User.filepath, 'r') as f:
                    users = json.load(f)
                
                if uuid in users:
                    del users[uuid]

                    with open(User.filepath, 'w') as f:
                        json.dump(users, f, indent=4)

                    return True
            except json.JSONDecodeError:
                pass

        return False
