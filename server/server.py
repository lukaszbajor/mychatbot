import logging

import os
from sanic import Sanic
from socketio import AsyncServer, AsyncClient

# Konfiguracja serwera
CONFIG = {
    "SERVER_URL": "0.0.0.0",
    # "localhost",
    "SERVER_PORT": 5000,
    "RASA_SOCKET_URL": "https://mychatbot-rasa.onrender.com",
    # "http://localhost:5005",
    "RASA_SOCKET_PATH": "/socket.io",  # Ścieżka Rasa WebSocket
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

    @rasa_sio.on("session_confirm")
    async def session_confirm(conversation_id):
        print(f"session_confirm, {conversation_id}")
        await sio.emit("session_confirm", {"conversation_id": conversation_id}, to=sid)
        sessions[sid] = conversation_id

    @rasa_sio.on("bot_uttered")
    async def bot_uttered(data):
        print(f"botutrr: {data}")
        await sio.emit("bot_uttered", data, to=sid)

    @rasa_sio.on("connect_error")
    async def connect_error(error):
        logging.error(f"Rasa connect_error, {error}")

    @rasa_sio.on("disconnect")
    async def disconnect():
        logging.error(f"Rasa disconnect")


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


# Krok 5: Rozłączenie klienta
@sio.on("disconnect")
async def disconnect(sid):
    logging.info(f"Client disconnected: {sid}")
    await rasa_sio.disconnect()
    if sid in sessions:
        logging.info(f"Removing session for SID={sid}")
        sessions.pop(sid, None)


@sio.on("get_survey")
async def get_survey(sid, data):
    conversation_id = data.get("conversation_id")
    print("Moje dane:" + conversation_id)

    survey = [
        {"label": "Ocena bota", "type": "number", "length": 10},
        {"label": "Komentarz", "type": "textarea", "length": 500},
    ]

    await sio.emit("get_survey_response", data=survey, to=sid)


@sio.on("submit_survey")
async def submit_survey(sid, data):
    # rates_bot=[
    #     {"input":"Ocena bota", "value":5},
    #     {"input":"Komentarz", "value":"Średnio to działa"},
    # ]

    # if data[0]["value"] > 5:
    #     await sio.emit(
    #         "bot_uttered", data={"text": "Dziękujemy za wypełnienie ankiety! Twoja ocena to"}, to=sid
    #     )
    # else:
    #     await sio.emit(
    #         "bot_uttered",
    #         data={"text": "Przykro nam, że bot nie spełnia Twoich oczekiwań :/"},
    #         to=sid,
    #     )

    rating = next(
        (item["value"] for item in data if item["input"] == "Ocena bota"), None
    )
    comment = next((item["value"] for item in data if item["input"] == "Komentarz"), "")

    # Sprawdź ocenę i przygotuj odpowiedź
    if rating is not None:
        if rating > 5:
            response_text = (
                f"Dziękujemy za wypełnienie ankiety!<br><br>"
                f"Twoja ocena to: <b>{rating}</b>.<br>"
                f"Twój komentarz:<br> <i>'{comment or 'Brak komentarza'}'</i>"
            )
        else:
            response_text = (
                f"Przykro nam, że bot nie spełnia Twoich oczekiwań.<br><br>"
                f"Twoja ocena to: <b>{rating}</b>.<br>"
                f"Twój komentarz:<br> <i>'{comment or 'Brak komentarza'}'</i>"
            )
        await sio.emit("bot_uttered", data={"text": response_text}, to=sid)


# Uruchomienie serwera
if __name__ == "__main__":
    # port = int(os.getenv("PORT", 8000))
    port = int(os.getenv("PORT", CONFIG["SERVER_PORT"]))
    app.run(host=CONFIG["SERVER_URL"], port=port)
