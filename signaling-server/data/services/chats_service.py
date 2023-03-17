import json
from .user_service import get_users

USERS_FILE_PATH = './data/database/users.json'
CHATS_FILE_PATH = './data/database/chats.json'


def get_user_chats(userIdn):
    chatIdns = []

    with open(USERS_FILE_PATH, 'r') as file:
        data = json.load(file)
        file.close()
        user = data.get(userIdn, {})
        chatIdns = user.get('chats', [])

    chats = []

    with open(CHATS_FILE_PATH, 'r') as file:
        data = json.load(file)
        file.close()

        for chatIdn in chatIdns:
            chat = data.get(chatIdn, {})
            userIdns = chat.get("userIdns", [])
            chats.append({
                "chatIdn": chatIdn,
                "chatName": chat.get('chatName', ''),
                "users": get_users(userIdns)
            })

    return chats


def get_chat_users(chatIdn):
    with open(CHATS_FILE_PATH, 'r') as file:
        data = json.load(file)
        file.close()

    chat = data.get(chatIdn, {})
    return chat.get("userIdns", [])
