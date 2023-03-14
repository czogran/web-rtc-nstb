from typing import Optional, Awaitable

import tornado.ioloop
import tornado.web
import tornado.websocket
from tornado.httpserver import HTTPServer
from tornado.web import Application, StaticFileHandler, RequestHandler
import json
from tornado.websocket import WebSocketHandler

from data.services.user_service import register_user, get_user, get_user_idn

import jwt

connected_clients = set()


class WebRTCSignalingHandler(WebSocketHandler):
    def check_origin(self, origin):
        print('origin')
        return True

    def open(self):
        print("open")
        connected_clients.add(self)

    def on_message(self, message):
        message = json.loads(message)
        if message["type"] == "OFFER":
            for client in connected_clients:
                if client != self:
                    client.write_message(json.dumps(message))
        elif message["type"] == "ANSWER":
            # Forward the answer to all connected clients except the sender
            for client in connected_clients:
                if client != self:
                    client.write_message(json.dumps(message))
        elif message["type"] == "ICE_CANDIDATE":
            # Forward the candidate to all connected clients except the sender
            for client in connected_clients:
                if client != self:
                    client.write_message(json.dumps(message))

    def on_close(self):
        connected_clients.remove(self)


chat_clients = set()


class ChatHandler(WebSocketHandler):
    def check_origin(self, origin):
        print('chat origin WebRTCChatHandler')
        return True

    def open(self):
        print("chat open")
        chat_clients.add(self)

    def on_message(self, message):
        message = json.loads(message)
        # print(message)
        # print(chat_clients)
        for client in chat_clients:
            if client != self:
                client.write_message(json.dumps(message))

    def on_close(self):
        print("aaaaaaaaaaaaaaa")
        # connected_clients.remove(self)


user = {"aa": "ww", "bb": "cc"}
loggedUsers = {}


class LoginHandler(RequestHandler):
    def set_default_headers(self):
        # self.set_header('Http-only', False)
        # self.set_header('secureCookie', False)
        self.set_header('Access-Control-Allow-Origin', '*')
        self.set_header('Access-Control-Allow-Headers', '*')
        self.set_header('Access-Control-Allow-Credentials', True)
        self.set_header('Access-Control-Max-Age', 1000)
        self.set_header('Content-type', 'text/plain')
        self.set_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        # self.set_header('Access-Control-Allow-Headers',
        #                 'Content-Type, Access-Control-Allow-Origin, Access-Control-Allow-Headers, X-Requested-By, '
        #                 'Access-Control-Allow-Methods')

    def open(self):
        print('new connection 1234')

    def post(self):
        request_body = self.request.body.decode('utf-8')
        content = json.loads(request_body)
        user_login = content.get("login", None)

        user_idn = get_user_idn(user_login)
        if user_idn is None:
            self.set_status(401)  # Set status code to 401 (Unauthorized)
            self.write("You are not registered.")
            self.finish()  # End the request handler
            return

        encoded = jwt.encode({"idn": user_idn}, "secret", algorithm="HS256")

        self.set_secure_cookie("user", encoded, expires_days=1, samesite="None", secure=True, httpOnly=True,
                               domain="nstb.com")

        self.write(encoded)
        self.finish()

    def on_close(self):
        print('connection closed')

    def check_origin(self, origin):
        print("origin")
        print(origin)

        return True

    def options(self):
        pass


class LogoutHandler(RequestHandler):
    def set_default_headers(self):
        self.set_header('Access-Control-Allow-Origin', '*')
        self.set_header('Access-Control-Allow-Headers', '*')
        self.set_header('Access-Control-Max-Age', 1000)
        self.set_header('Content-type', 'application/json')
        self.set_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        # self.set_header('Access-Control-Allow-Headers',
        #                 'Content-Type, Access-Control-Allow-Origin, Access-Control-Allow-Headers, X-Requested-By, '
        #                 'Access-Control-Allow-Methods')

    def open(self):
        print('new connection 1234')

    def post(self):
        self.clear_cookie("user")
        request_body = self.request.body.decode('utf-8')
        content = json.loads(request_body)
        user_login = user.get(content.get("login"))
        loggedUsers[self.get_secure_cookie('user')] = user_login

        self.finish()

    def on_close(self):
        print('connection closed')

    def check_origin(self, origin):
        return True

    def options(self):
        pass


class RegisterHandler(RequestHandler):
    def set_default_headers(self):
        self.set_header('Access-Control-Allow-Origin', '*')
        self.set_header('Access-Control-Allow-Headers', '*')
        self.set_header('Access-Control-Max-Age', 1000)
        self.set_header('Content-type', 'application/json')
        self.set_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        # self.set_header('Access-Control-Allow-Headers',
        #                 'Content-Type, Access-Control-Allow-Origin, Access-Control-Allow-Headers, X-Requested-By, '
        #                 'Access-Control-Allow-Methods')

    def open(self):
        print('new connection 1234')

    def post(self):
        request_body = self.request.body.decode('utf-8')
        content = json.loads(request_body)
        register_user(content)

        self.finish()

    def on_close(self):
        print('connection closed')

    def check_origin(self, origin):
        return True

    def options(self):
        pass


class UserDataHandler(RequestHandler):

    def set_default_headers(self):
        self.set_header('Access-Control-Allow-Origin', '*')
        self.set_header('Access-Control-Allow-Headers', '*')
        self.set_header('Access-Control-Max-Age', 1000)
        self.set_header('Content-type', 'application/json')
        self.set_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        # self.set_header('Access-Control-Allow-Headers',
        #                 'Origin, Content-Type, X-Auth-Token')

    def open(self):
        print('new connection 1234')

    def post(self):

        token = self.request.headers.get("Token", "DAWID MISTRZ")

        decoded_cookie = jwt.decode(token, "secret", algorithms=["HS256"])
        user_idn = decoded_cookie.get("idn", None)
        print(decoded_cookie)
        print(user_idn)
        if user_idn is None:
            self.set_status(401)  # Set status code to 401 (Unauthorized)
            self.write("You are not authorized to access this resource.")
            self.finish()  # End the request handler
        else:
            self.write(get_user(user_idn))

    def on_close(self):
        print('connection closed')

    def check_origin(self, origin):
        return True

    def options(self):
        pass


class UserChatsHandler(RequestHandler):
    userChats = [{'chatIdn': 'chat1', 'users': [{"userIdn": "ww", "name": "Paweł", "surname": "Raweł"}]},
                 {'chatIdn': 'chat2', 'users': [{"userIdn": "cc", "name": "Dawid", "surname": "Gru"}]}]

    def set_default_headers(self):
        self.set_header('Access-Control-Allow-Origin', '*')
        self.set_header('Access-Control-Allow-Headers', '*')
        self.set_header('Access-Control-Max-Age', 1000)
        self.set_header('Content-type', 'application/json')
        self.set_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        # self.set_header('Access-Control-Allow-Headers',
        #                 'Content-Type, Access-Control-Allow-Origin, Access-Control-Allow-Headers, X-Requested-By, '
        #                 'Access-Control-Allow-Methods')

    def open(self):
        print('new connection 1234')

    def post(self):
        request_body = self.request.body.decode('utf-8')
        content = json.loads(request_body)
        self.write({"chats": self.userChats})
        # self.write(str(self.userChats))

    def on_close(self):
        print('connection closed')

    def check_origin(self, origin):
        return True

    def options(self):
        pass


application = Application([
    (r"/login", LoginHandler),
    (r"/logout", LogoutHandler),
    (r"/register", RegisterHandler),
    (r"/user-data", UserDataHandler),
    (r"/user-chats", UserChatsHandler),
    (r"/signaling", WebRTCSignalingHandler),
    (r"/chat", ChatHandler),
], cookie_secret="__TODO:_GENERATE_YOUR_OWN_RANDOM_VALUE_HERE__")

if __name__ == "__main__":
    # http_server = HTTPServer(application)
    # application.listen(8765, address='localhost')
    application.listen(8765)
    print("SERVER START")
    tornado.ioloop.IOLoop.current().start()
