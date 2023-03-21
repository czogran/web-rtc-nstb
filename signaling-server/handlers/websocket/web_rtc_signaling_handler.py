import json

from data.services.chats_service import get_chat_users
from handlers.common.base_handler import BaseHandler
from tornado.websocket import WebSocketHandler

connected_clients = {}


class WebRTCSignalingHandler(BaseHandler, WebSocketHandler):
    user_idn = ""

    def on_message(self, message):
        print(message)
        message = json.loads(message)
        message_type = message["type"]

        if message.get('type', '') == 'CONNECT':
            self.user_idn = message.get("userIdn", "")

            connected_clients[self.user_idn] = ({"instance": self})
            return

        if message_type not in ["OFFER", "ANSWER", "ICE_CANDIDATE", "END"]:
            return

        chat_idn = message.get("chatIdn", "")
        chat_user_idns = get_chat_users(chat_idn)

        recipent_idn = message.get("recipentIdn", "")
        connection_index = chat_user_idns.index(recipent_idn)
        user_idn = chat_user_idns[connection_index]

        instance = connected_clients.get(user_idn, {})
        connection = instance.get("instance")

        if connection is not None:
            connection.write_message(json.dumps(message))

    def on_close(self):
        del connected_clients[self.user_idn]
