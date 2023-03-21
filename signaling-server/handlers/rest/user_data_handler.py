from handlers.common.base_handler import BaseHandler

from data.services.user_service import get_user

class UserDataRestHandler(BaseHandler):

    def set_default_headers(self):
        super().set_default_headers()
        self.set_header('Access-Control-Allow-Methods', 'POST')

    def post(self):
        user_idn = self.check_header_cookie(self.request)
        if user_idn is not None:
            self.write(get_user(user_idn))