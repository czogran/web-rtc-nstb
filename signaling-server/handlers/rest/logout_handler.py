from handlers.common.base_handler import BaseHandler


class LogoutRestHandler(BaseHandler):
    def set_default_headers(self):
        super().set_default_headers()
        self.set_header('Access-Control-Allow-Methods', 'POST')

    def post(self):
        self.clear_cookie("user")
        self.finish()
