import json
import uuid

from .user_service import get_users, get_users_data, add_user_chats

CHATS_FILE_PATH = './data/database/chats.json'


def get_chats_data():
    with open(CHATS_FILE_PATH, 'r') as file:
        data = json.load(file)
        file.close()
    return data


def get_user_chats(user_idn):
    user_data = get_users_data()
    user = user_data.get(user_idn, {})
    chat_idns = user.get('chats', [])

    chats = []

    data = get_chats_data()

    for chatIdn in chat_idns:
        chat = data.get(chatIdn, {})
        user_idns = chat.get("userIdns", [])
        chats.append({
            "chatIdn": chatIdn,
            "chatName": chat.get('chatName', ''),
            "users": get_users(user_idns)
        })

    return chats


def get_chat_users(chat_idn):
    data = get_chats_data()
    chat = data.get(chat_idn, {})
    return chat.get("userIdns", [])


def add_chat(users_idns):
    data = get_chats_data()

    idn = str(uuid.uuid4())
    new_chat = {"chatName": "", "userIdns": users_idns}
    data[idn] = new_chat
    with open(CHATS_FILE_PATH, 'w') as file:
        json.dump(data, file)
        file.close()

    add_user_chats(users_idns, idn)
    return new_chat
