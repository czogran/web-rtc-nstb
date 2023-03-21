import tornado.ioloop
import tornado.websocket
from tornado.web import Application

from handlers.rest.create_chat_handler import CreateChatRestHandler
from handlers.rest.login_handler import LoginRestHandler
from handlers.rest.logout_handler import LogoutRestHandler
from handlers.rest.register_handler import RegisterRestHandler
from handlers.rest.search_users_handler import SearchUsersRestHandler
from handlers.rest.user_chats_handler import UserChatsRestHandler
from handlers.rest.user_data_handler import UserDataRestHandler
from handlers.websocket.chat_handler import ChatHandler
from handlers.websocket.web_rtc_signaling_handler import WebRTCSignalingHandler

application = Application([
    (r"/login", LoginRestHandler),
    (r"/logout", LogoutRestHandler),
    (r"/register", RegisterRestHandler),
    (r"/user-data", UserDataRestHandler),
    (r"/user-chats", UserChatsRestHandler),
    (r"/search-users", SearchUsersRestHandler),
    (r"/create-chat", CreateChatRestHandler),
    (r"/signaling", WebRTCSignalingHandler),
    (r"/chat", ChatHandler),
], cookie_secret="__TODO:_GENERATE_YOUR_OWN_RANDOM_VALUE_HERE__")

if __name__ == "__main__":
    application.listen(8765)
    print("SERVER START")
    tornado.ioloop.IOLoop.current().start()
