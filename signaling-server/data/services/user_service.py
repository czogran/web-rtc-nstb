import io
import json
import uuid

USERS_FILE_PATH = './data/database/users.json'
USERS_LOGIN_FILE_PATH = './data/database/users-login.json'


def get_users_data():
    with open(USERS_FILE_PATH, 'r') as file:
        data = json.load(file)
        file.close()
    return data


def register_user(user):
    user['idn'] = str(uuid.uuid4())
    user['chats'] = []

    with open(USERS_LOGIN_FILE_PATH, 'r') as file:
        data = json.load(file)
        file.close()

    with open(USERS_LOGIN_FILE_PATH, 'w') as file:
        data[user.get('login')] = user.get("idn")
        json.dump(data, file)
        file.close()

    del user["login"]

    data = get_users_data()
    data[user.get('idn')] = user

    with open(USERS_FILE_PATH, 'w') as file:
        json.dump(data, file)
        file.close()


def get_user(idn):
    data = get_users_data()
    user = data.get(idn, {})
    del user["chats"]
    return user


def get_users(idns):
    data = get_users_data()

    users = []
    for idn in idns:
        users.append(data.get(idn, {}))

    return users


def get_user_idn(login):
    with io.open(USERS_LOGIN_FILE_PATH, 'r') as file:
        data = json.load(file)
        file.close()
        return data.get(login, None)


def search_users(query, user_idn):
    if len(query) < 2:
        return []
    data = get_users_data()
    users = data.values()

    query = query.lower()

    found_users = []
    for user in users:
        if user.get("idn") == user_idn:
            continue

        search_string = (user.get("nickname", "") + user.get("name", "") + " " + user.get("surname", "")).lower()
        if query in search_string:
            del user["chats"]
            found_users.append(user)
        if len(found_users) > 15:
            break
    return found_users


def add_user_chats(user_idns, chat_idn):
    data = get_users_data()

    for idn in user_idns:
        user = data.get(idn)
        if user is None:
            continue
        chats = user.get("chats", [])
        chats.append(chat_idn)
        data[idn]["chats"] = chats

    with open(USERS_FILE_PATH, 'w') as file:
        json.dump(data, file)
        file.close()
