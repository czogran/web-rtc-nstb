import json

import jwt
from data.services.user_service import get_user_idn

from handlers.common.base_handler import BaseHandler


class LoginRestHandler(BaseHandler):
    def set_default_headers(self):
        super().set_default_headers()
        self.set_header('Access-Control-Allow-Methods', 'POST')

    def post(self):
        request_body = self.request.body.decode('utf-8')

        content = json.loads(request_body)
        user_login = content.get("login", None)

        user_idn = get_user_idn(user_login)
        if user_idn is None:
            self.set_status(401)
            self.write("You are not registered.")
            self.finish()
            return

        encoded = jwt.encode({"idn": user_idn}, "secret", algorithm="HS256")

        self.set_secure_cookie("user", encoded, expires_days=1, samesite="None", secure=True, httpOnly=True)

        self.write(encoded)
        self.finish()
