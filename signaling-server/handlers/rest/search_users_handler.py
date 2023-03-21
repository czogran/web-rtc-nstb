import json

from data.services.user_service import search_users

from handlers.common.base_handler import BaseHandler


class SearchUsersRestHandler(BaseHandler):
    def set_default_headers(self):
        super().set_default_headers()
        self.set_header('Access-Control-Allow-Methods', 'POST')

    def post(self):
        user_idn = self.check_header_cookie(self.request)
        if user_idn is None:
            return

        request_body = self.request.body.decode('utf-8')
        content = json.loads(request_body)

        query = content.get("query", "")
        users = search_users(query, user_idn)
        self.write({"users": users})