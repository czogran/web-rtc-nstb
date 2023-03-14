import json
import io
import uuid

USERS_FILE_PATH = './data/database/users.json'
USERS_LOGIN_FILE_PATH = './data/database/users-login.json'

def register_user(user):
    user['idn'] = str(uuid.uuid4())

    with open(USERS_LOGIN_FILE_PATH, 'r') as file:
        data = json.load(file)
        file.close()

    with open(USERS_LOGIN_FILE_PATH, 'w') as file:
        data[user.get('login')] = user.get("idn")
        json.dump(data, file)
        file.close()

    del user["login"]

    with open(USERS_FILE_PATH, 'r') as file:
        data = json.load(file)
        data[user.get('idn')] = user
        file.close()

    with open(USERS_FILE_PATH, 'w') as file:
        json.dump(data, file)
        file.close()


def get_user(idn):
    with io.open(USERS_FILE_PATH, 'r') as file:
        data = json.load(file)
        file.close()
        return data.get(idn, {})

def get_user_idn(login):
    with io.open(USERS_LOGIN_FILE_PATH, 'r') as file:
        data = json.load(file)
        file.close()
        return data.get(login, None)
