from data.services.chats_service import get_user_chats

from handlers.common.base_handler import BaseHandler


class UserChatsRestHandler(BaseHandler):
    def set_default_headers(self):
        super().set_default_headers()
        self.set_header('Access-Control-Allow-Methods', 'POST')

    def post(self):
        user_idn = self.check_header_cookie(self.request)
        if user_idn is None:
            return
        chats = get_user_chats(user_idn)

        self.write({"chats": chats})
