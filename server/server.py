import logging

import os
from sanic import Sanic
from socketio import AsyncServer, AsyncClient

# Konfiguracja serwera
# CONFIG = {
#     "SERVER_URL": "localhost",
#     # "0.0.0.0",
#     "SERVER_PORT": 5000,
#     "RASA_SOCKET_URL": "http://localhost:5005",
#     # "https://mychatbot-rasa.onrender.com",
#     "RASA_SOCKET_PATH": "",  # Ścieżka Rasa WebSocket
# }

# # Tworzenie aplikacji Sanic i Socket.IO
# app = Sanic("chat_server")
# sio = AsyncServer(
#     async_mode="sanic",
#     cors_allowed_origins="*",
#     logger=False,
#     engineio_logger=False,
# )
# sio.attach(app)

# # Logowanie
# logging.basicConfig(level=logging.DEBUG)

# # Przechowywanie sesji: SID -> Conversation ID
# sessions = {}

# rasa_sio = AsyncClient()


# # Krok 1: Połączenie klienta
# @sio.on("connect")
# async def connect(sid, environ):
#     logging.info(f"Client connected: {sid}")
#     # Na razie nie przypisujemy Conversation ID, czekamy na `session_request`


# # Krok 2: Przypisanie Conversation ID (np. przy starcie sesji)
# @sio.on("session_request")
# async def session_request(sid, data):
#     conversation_id = data.get("conversation_id")

#     try:
#         if CONFIG["RASA_SOCKET_PATH"]:
#             await rasa_sio.connect(
#                 url=CONFIG["RASA_SOCKET_URL"], socketio_path=CONFIG["RASA_SOCKET_PATH"]
#             )
#         else:
#             await rasa_sio.connect(url=CONFIG["RASA_SOCKET_URL"])
#     except Exception as e:
#         logging.error(e)
#         return

#     await rasa_sio.emit("session_request", {"session_id": conversation_id})

#     @rasa_sio.on("connect")
#     async def connect():
#         logging.info(f"Rasa connect")

#     @rasa_sio.on("session_confirm")
#     async def session_confirm(conversation_id):
#         print(f"session_confirm, {conversation_id}")
#         await sio.emit("session_confirm", {"conversation_id": conversation_id}, to=sid)
#         sessions[sid] = conversation_id

#     @rasa_sio.on("bot_uttered")
#     async def bot_uttered(data):
#         print(f"botutrr: {data}")
#         await sio.emit("bot_uttered", data, to=sid)

#     @rasa_sio.on("connect_error")
#     async def connect_error(error):
#         logging.error(f"Rasa connect_error, {error}")

#     @rasa_sio.on("disconnect")
#     async def disconnect():
#         logging.error(f"Rasa disconnect")


# # Krok 3: Wysyłanie wiadomości użytkownika do Rasa
# @sio.on("user_uttered")
# async def user_uttered(sid, data):
#     conversation_id = sessions.get(sid)
#     if not conversation_id:
#         logging.error(f"No session found for SID={sid}")
#         return

#     user_message = data.get("message")
#     if not user_message:
#         logging.error("Empty message received")
#         return
#     await rasa_sio.emit("user_uttered", data)
#     logging.info(f"User_uttered: {sid}")


# # Krok 5: Rozłączenie klienta
# @sio.on("disconnect")
# async def disconnect(sid):
#     logging.info(f"Client disconnected: {sid}")
#     await rasa_sio.disconnect()
#     if sid in sessions:
#         logging.info(f"Removing session for SID={sid}")
#         sessions.pop(sid, None)


# @sio.on("get_survey")
# async def get_survey(sid, data):
#     conversation_id = data.get("conversation_id")
#     print("Moje dane:" + conversation_id)

#     survey = [
#         {"label": "Ocena bota", "type": "number", "length": 10},
#         {"label": "Komentarz", "type": "textarea", "length": 500},
#     ]

#     await sio.emit("get_survey_response", data=survey, to=sid)


# @sio.on("submit_survey")
# async def submit_survey(sid, data):
#     # rates_bot=[
#     #     {"input":"Ocena bota", "value":5},
#     #     {"input":"Komentarz", "value":"Średnio to działa"},
#     # ]

#     # if data[0]["value"] > 5:
#     #     await sio.emit(
#     #         "bot_uttered", data={"text": "Dziękujemy za wypełnienie ankiety! Twoja ocena to"}, to=sid
#     #     )
#     # else:
#     #     await sio.emit(
#     #         "bot_uttered",
#     #         data={"text": "Przykro nam, że bot nie spełnia Twoich oczekiwań :/"},
#     #         to=sid,
#     #     )

#     rating = next(
#         (item["value"] for item in data if item["input"] == "Ocena bota"), None
#     )
#     comment = next((item["value"] for item in data if item["input"] == "Komentarz"), "")

#     # Sprawdź ocenę i przygotuj odpowiedź
#     if rating is not None:
#         if rating > 5:
#             response_text = (
#                 f"Dziękujemy za wypełnienie ankiety!<br><br>"
#                 f"Twoja ocena to: <b>{rating}</b>.<br>"
#                 f"Twój komentarz:<br> <i>'{comment or 'Brak komentarza'}'</i>"
#             )
#         else:
#             response_text = (
#                 f"Przykro nam, że bot nie spełnia Twoich oczekiwań.<br><br>"
#                 f"Twoja ocena to: <b>{rating}</b>.<br>"
#                 f"Twój komentarz:<br> <i>'{comment or 'Brak komentarza'}'</i>"
#             )
#         await sio.emit("bot_uttered", data={"text": response_text}, to=sid)


# # Uruchomienie serwera
# if __name__ == "__main__":
#     # port = int(os.getenv("PORT", 8000))
#     port = int(os.getenv("PORT", CONFIG["SERVER_PORT"]))
#     app.run(host=CONFIG["SERVER_URL"], port=port, debug=False, access_log=True)


CONFIG = {
    "SERVER_URL": "0.0.0.0",
    "SERVER_PORT": 5000,
    "RASA_SOCKET_URL": "https://mychatbot-rasa.onrender.com",
    "RASA_SOCKET_PATH": "/socket.io",  # Ścieżka WebSocket do Rasa
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

# Klient do Rasa
rasa_sio = AsyncClient()


# Krok 1: Połączenie klienta
@sio.on("connect")
async def connect(sid, environ):
    logging.info(f"Client connected: {sid}")
    # Testowanie prostych wiadomości
    await sio.emit("message", {"text": "Test message from server"}, to=sid)


# Krok 2: Przypisanie Conversation ID (np. przy starcie sesji)
@sio.on("session_request")
async def session_request(sid, data):
    conversation_id = data.get("conversation_id")

    if sid in sessions:
        logging.info(f"Session already exists for SID={sid}, skipping session request.")
        return  # Jeśli klient ma już przypisaną sesję, nie wykonuj kolejnej

    try:
        # Połączenie z Rasa, jeśli jeszcze nie jest połączone
        if not rasa_sio.connected:
            if CONFIG["RASA_SOCKET_PATH"]:
                await rasa_sio.connect(
                    url=CONFIG["RASA_SOCKET_URL"],
                    socketio_path=CONFIG["RASA_SOCKET_PATH"],
                )
            else:
                await rasa_sio.connect(url=CONFIG["RASA_SOCKET_URL"])
        else:
            logging.info("Rasa already connected, skipping connection.")
    except Exception as e:
        logging.error(f"Error connecting to Rasa: {e}")
        return

    # Jeśli klient nie miał jeszcze przypisanej sesji, przypisz mu conversation_id
    await rasa_sio.emit("session_request", {"session_id": conversation_id})

    # Nasłuchiwanie na odpowiedź od Rasa
    @rasa_sio.on("connect")
    async def rasa_connect():
        logging.info("Rasa connected")

    @rasa_sio.on("session_confirm")
    async def session_confirm(data):
        # Obsługuje różne formaty danych
        logging.info(f"Received data in session_confirm: {data}")

        if isinstance(data, str):
            conversation_id = data
        elif isinstance(data, dict):
            conversation_id = data.get("conversation_id")
        else:
            logging.error(f"Unexpected data format in session_confirm: {data}")
            return

        if conversation_id:
            logging.info(f"Session confirmed: {conversation_id}")
            sessions[sid] = conversation_id  # Zapiszemy conversation_id dla klienta
            await sio.emit(
                "session_confirm", {"conversation_id": conversation_id}, to=sid
            )
        else:
            logging.error(f"Session confirmation failed: {data}")

    @rasa_sio.on("bot_uttered")
    async def bot_uttered(data):
        logging.info(f"Bot response received: {data}")

        # Jeżeli odpowiedź nie zawiera session_id, przypisz je z sesji
        session_id = sessions.get(sid)
        if not session_id:
            logging.error(f"No session found for SID={sid}, unable to send response.")
            return

        # Przypisujemy session_id do odpowiedzi bota
        if not data.get("session_id"):
            data["session_id"] = session_id

        logging.info(f"Sending bot response to client SID={sid} with data: {data}")
        # Wysyłanie odpowiedzi tylko do klienta przypisanego do sesji
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

    logging.info(f"User message: {user_message}")
    await rasa_sio.emit("user_uttered", data)


# Krok 4: Rozłączenie klienta
@sio.on("disconnect")
async def disconnect(sid):
    logging.info(f"Client disconnected: {sid}")
    if sid in sessions:
        logging.info(f"Removing session for SID={sid}")
        sessions.pop(sid, None)


# Uruchomienie serwera
if __name__ == "__main__":
    port = int(os.getenv("PORT", CONFIG["SERVER_PORT"]))
    app.run(host=CONFIG["SERVER_URL"], port=port, debug=True, access_log=True)
