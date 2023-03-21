import jwt
from tornado.web import RequestHandler


class BaseHandler(RequestHandler):
    def set_default_headers(self):
        self.set_header('Access-Control-Allow-Origin', '*')
        self.set_header('Access-Control-Allow-Headers', '*')
        self.set_header('Access-Control-Max-Age', 1000)
        self.set_header('Content-type', 'application/json')


        # self.set_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        # self.set_header('Access-Control-Allow-Headers',
        #                 'Content-Type, Access-Control-Allow-Origin, Access-Control-Allow-Headers, X-Requested-By, '
        #                 'Access-Control-Allow-Methods')

    def open(self):
        pass

    def check_header_cookie(self, request):
        token = request.headers.get("Token")
        if token is None:
            self.set_status(401)  # Set status code to 401 (Unauthorized)
            self.write("You are not authorized to access this resource.")
            self.finish()  # End the request handler
            return

        decoded_cookie = jwt.decode(token, "secret", algorithms=["HS256"])
        user_idn = decoded_cookie.get("idn", None)
        return user_idn


    def on_close(self):
        pass

    def check_origin(self, origin):
        return True

    def options(self):
        pass
