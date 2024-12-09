import logging
from sanic import Sanic
from socketio import AsyncServer, AsyncClient

# Konfiguracja serwera
CONFIG = {
    "SERVER_URL": "localhost",
    "SERVER_PORT": 5000,
    "RASA_SOCKET_URL": "http://localhost:5005",  # Adres Rasa
    "RASA_SOCKET_PATH": "",  # Ścieżka Rasa WebSocket
}

# Tworzenie aplikacji Sanic i Socket.IO
app = Sanic("chat_server")
sio = AsyncServer(
    async_mode="sanic",
    cors_allowed_origins="*",
    logger=False,
    engineio_logger=False,
)
sio.attach(app)

# Logowanie
logging.basicConfig(level=logging.DEBUG)

# Przechowywanie sesji: SID -> Conversation ID
sessions = {}

rasa_sio = AsyncClient()


# Krok 1: Połączenie klienta
@sio.on("connect")
async def connect(sid, environ):
    logging.info(f"Client connected: {sid}")
    # Na razie nie przypisujemy Conversation ID, czekamy na `session_request`


# Krok 2: Przypisanie Conversation ID (np. przy starcie sesji)
@sio.on("session_request")
async def session_request(sid, data):
    conversation_id = data.get("conversation_id")

    try:
        if CONFIG["RASA_SOCKET_PATH"]:
            await rasa_sio.connect(
                url=CONFIG["RASA_SOCKET_URL"], socketio_path=CONFIG["RASA_SOCKET_PATH"]
            )
        else:
            await rasa_sio.connect(url=CONFIG["RASA_SOCKET_URL"])
    except Exception as e:
        logging.error(e)
        return

    await rasa_sio.emit("session_request", {"session_id": conversation_id})

    @rasa_sio.on("connect")
    async def connect():
        logging.info(f"Rasa connect")

    @rasa_sio.on("connect_error")
    async def connect_error(error):
        logging.error(f"Rasa connect_error, {error}")

    @rasa_sio.on("disconnect")
    async def disconnect():
        logging.error(f"Rasa disconnect")

    @rasa_sio.on("session_confirm")
    async def session_confirm(conversation_id):
        print(f"session_confirm, {conversation_id}")
        await sio.emit("session_confirm", {"conversation_id": conversation_id}, to=sid)
        sessions[sid] = conversation_id

    @rasa_sio.on("bot_uttered")
    async def bot_uttered(data):
        print(f"botutrr: {data}")
        await sio.emit("bot_uttered", data, to=sid)


# Krok 3: Wysyłanie wiadomości użytkownika do Rasa
@sio.on("user_uttered")
async def user_uttered(sid, data):
    conversation_id = sessions.get(sid)
    if not conversation_id:
        logging.error(f"No session found for SID={sid}")
        return

    user_message = data.get("message")
    if not user_message:
        logging.error("Empty message received")
        return
    await rasa_sio.emit("user_uttered", data)
    logging.info(f"User_uttered: {sid}")


# Krok 4: Odebranie odpowiedzi od Rasa
# @sio.on("bot_uttered")
# async def handle_bot_message(data):
#     conversation_id = data.get("conversation_id")
#     if not conversation_id:
#         logging.error("No conversation_id in bot message")
#         return

#     # Znajdź SID na podstawie Conversation ID
#     sid = next((k for k, v in sessions.items() if v == conversation_id), None)
#     if not sid:
#         logging.error(f"No client found for Conversation ID={conversation_id}")
#         return

#     # Przekaż wiadomość z Rasa do klienta
#     bot_message = data.get("text", "No message from bot")
#     logging.info(f"Sending message to client {sid}: {bot_message}")
#     await sio.emit("bot_uttered", {"text": bot_message}, to=sid)


# Krok 5: Rozłączenie klienta
@sio.on("disconnect")
async def disconnect(sid):
    logging.info(f"Client disconnected: {sid}")
    await rasa_sio.disconnect()
    if sid in sessions:
        logging.info(f"Removing session for SID={sid}")
        sessions.pop(sid, None)


# Uruchomienie serwera
if __name__ == "__main__":
    app.run(host=CONFIG["SERVER_URL"], port=CONFIG["SERVER_PORT"])
