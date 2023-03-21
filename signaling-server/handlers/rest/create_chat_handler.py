import json

from data.services.chats_service import add_chat

from handlers.common.base_handler import BaseHandler

class CreateChatRestHandler(BaseHandler):
    def set_default_headers(self):
        super().set_default_headers()
        self.set_header('Access-Control-Allow-Methods', 'POST')

    def post(self):
        user_idn = self.check_header_cookie(self.request)
        if user_idn is None:
            return

        request_body = self.request.body.decode('utf-8')
        content = json.loads(request_body)

        user_idns = content.get("userIdns", [])
        user_idns.append(user_idn)
        new_chat = add_chat(user_idns)
        self.write(new_chat)
