from typing import Optional, Awaitable

import tornado.ioloop
import tornado.web
import tornado.websocket
from tornado.httpserver import HTTPServer
from tornado.web import Application, StaticFileHandler, RequestHandler
import json
from tornado.websocket import WebSocketHandler

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
        self.set_header('Access-Control-Allow-Origin', '*')
        self.set_header('Access-Control-Allow-Headers', '*')
        self.set_header('Access-Control-Max-Age', 1000)
        self.set_header('Content-type', 'application/json')
        self.set_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.set_header('Access-Control-Allow-Headers',
                        'Content-Type, Access-Control-Allow-Origin, Access-Control-Allow-Headers, X-Requested-By, '
                        'Access-Control-Allow-Methods')

    def open(self):
        print('new connection 1234')

    def post(self):
        self.set_secure_cookie("user", 'hahahah')
        # self.set_cookie("user", 'hahahah')

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

class LogoutHandler(RequestHandler):
    def set_default_headers(self):
        self.set_header('Access-Control-Allow-Origin', '*')
        self.set_header('Access-Control-Allow-Headers', '*')
        self.set_header('Access-Control-Max-Age', 1000)
        self.set_header('Content-type', 'application/json')
        self.set_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.set_header('Access-Control-Allow-Headers',
                        'Content-Type, Access-Control-Allow-Origin, Access-Control-Allow-Headers, X-Requested-By, '
                        'Access-Control-Allow-Methods')

    def open(self):
        print('new connection 1234')

    def post(self):
        self.clear_cookie("user")
        # self.set_cookie("user", 'hahahah')

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


class UserDataHandler(RequestHandler):

    def set_default_headers(self):
        self.set_header('Access-Control-Allow-Origin', '*')
        self.set_header('Access-Control-Allow-Headers', '*')
        self.set_header('Access-Control-Max-Age', 1000)
        self.set_header('Content-type', 'application/json')
        self.set_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.set_header('Access-Control-Allow-Headers',
                        'Content-Type, Access-Control-Allow-Origin, Access-Control-Allow-Headers, X-Requested-By, '
                        'Access-Control-Allow-Methods')

    def open(self):
        print('new connection 1234')

    def post(self):
        login =  loggedUsers.get(self.get_secure_cookie('user'))
        if login is None:
            self.set_status(401)  # Set status code to 401 (Unauthorized)
            self.write("You are not authorized to access this resource.")
            self.finish()  # End the request handler

             # self.write_error(404)
        else:
            self.write({"userIdn": user.get(login), "name": "Paweł", "surname": "Raweł"})

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
        self.set_header('Access-Control-Allow-Headers',
                        'Content-Type, Access-Control-Allow-Origin, Access-Control-Allow-Headers, X-Requested-By, '
                        'Access-Control-Allow-Methods')

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
    (r"/user-data", UserDataHandler),
    (r"/user-chats", UserChatsHandler),
    (r"/signaling", WebRTCSignalingHandler),
    (r"/chat", ChatHandler),
], cookie_secret="__TODO:_GENERATE_YOUR_OWN_RANDOM_VALUE_HERE__")

if __name__ == "__main__":
    # http_server = HTTPServer(application)
    application.listen(8765)
    print("SERVER START")
    tornado.ioloop.IOLoop.current().start()
