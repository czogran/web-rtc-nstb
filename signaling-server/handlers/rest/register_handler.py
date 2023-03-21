import json

from handlers.common.base_handler import BaseHandler

from data.services.user_service import register_user

class RegisterRestHandler(BaseHandler):
    def set_default_headers(self):
        super().set_default_headers()
        self.set_header('Access-Control-Allow-Methods', 'POST')

    def post(self):
        request_body = self.request.body.decode('utf-8')
        content = json.loads(request_body)
        register_user(content)
        self.finish()
