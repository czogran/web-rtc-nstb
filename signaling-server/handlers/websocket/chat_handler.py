import json

from data.services.chats_service import get_chat_users
from handlers.common.base_handler import BaseHandler
from tornado.websocket import WebSocketHandler

chat_clients = {}


class ChatHandler(BaseHandler, WebSocketHandler):
    userIdn = ""


    def on_message(self, message):
        message = json.loads(message)

        if message.get('type', '') == 'CONNECT':
            self.userIdn = message.get("userIdn", "")
            chat_clients[self.userIdn] = ({"instance": self})
            return

        chat_idn = message.get("chatIdn")
        if chat_idn is None:
            return
        user_idns = get_chat_users(chat_idn)

        for userIdn in user_idns:
            chat = chat_clients.get(userIdn, {}).get("instance")
            if chat is not None:
                chat.write_message(json.dumps(message))

    def on_close(self):
        del chat_clients[self.userIdn]
