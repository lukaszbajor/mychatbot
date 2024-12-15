import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRobot,
  faX,
  faEllipsisVertical,
  faTrashCan,
  faVolumeUp,
  faMicrophone,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { useChat } from "../../context/ChatbotContext";
import styles from "./ChatbotHeader.module.css";
import { useEffect, useState } from "react";

interface ChatbotHeaderProps {
  toggleChat: () => void;
}

function ChatbotHeader({ toggleChat }: ChatbotHeaderProps) {
  const [moreBtnsIsOpen, setMoreBtnsIsOpen] = useState(false);

  const {
    setMessages,
    socket,
    conversationId,
    setConversationId,
    setIsOpen,
    isVoiceReadingEnabled,
    setIsVoiceReadingEnabled,
    isVoiceInputEnabled,
    isShowSurveyForm,
    setIsVoiceInputEnabled,
    setFirstMessageFromBot,
    setIsShowSurveyForm,
  } = useChat();

  function handleDisconnectChat() {
    setFirstMessageFromBot(true);
    if (socket) {
      socket.disconnect(); // Rozłączamy socket
      console.log("Disconnected from chat");

      // Resetowanie wiadomości i conversationId
      setMessages([]); // Czyszczenie wiadomości
      setConversationId(null); // Resetowanie ID konwersacji

      // Ponowne połączenie i rozpoczęcie nowej konwersacji
      socket.connect(); // Łączymy się ponownie
      console.log("Reconnected to chat");

      // Możesz tu dodać inicjalizację nowej sesji
      //   socket.emit("session_request", { conversation_id: null }); // Rozpoczynamy nową konwersację
    }

    setMoreBtnsIsOpen(false);
    setIsOpen(false);
  }

  return (
    <>
      <div className={styles.header}>
        <h3 className={styles.title}>
          Wirtualny asystent <FontAwesomeIcon icon={faRobot} />
        </h3>
        <div>
          <button
            className={styles.btn}
            onClick={() => {
              setMoreBtnsIsOpen(!moreBtnsIsOpen);
            }}
          >
            <FontAwesomeIcon icon={faEllipsisVertical} />
          </button>
          <button className={styles.btn} onClick={toggleChat}>
            <FontAwesomeIcon icon={faX} />
          </button>
        </div>
      </div>
      {moreBtnsIsOpen && (
        <div className={styles.moreBtns}>
          <button className={styles.optionBtn} onClick={handleDisconnectChat}>
            <FontAwesomeIcon icon={faTrashCan} />
            Zakończ chat
          </button>
          <button
            className={styles.optionBtn}
            onClick={() => {
              setIsVoiceReadingEnabled((prev: any) => !prev);
              setMoreBtnsIsOpen(!moreBtnsIsOpen);
            }}
          >
            <FontAwesomeIcon icon={faVolumeUp} />
            {isVoiceReadingEnabled ? "Wyłącz czytanie" : "Włącz czytanie"}
          </button>
          <button
            className={styles.optionBtn}
            onClick={() => {
              setIsVoiceInputEnabled((prev: any) => !prev);
              setMoreBtnsIsOpen(!moreBtnsIsOpen);
            }}
          >
            <FontAwesomeIcon icon={faMicrophone} />
            {isVoiceInputEnabled ? "Wyłącz mikrofon" : "Włącz mikrofon"}
          </button>
          <button
            className={styles.optionBtn}
            onClick={() => {
              setIsShowSurveyForm(!isShowSurveyForm);
              setMoreBtnsIsOpen(!moreBtnsIsOpen);
              socket?.emit("get_survey", { conversation_id: conversationId });
            }}
          >
            <FontAwesomeIcon icon={faStar} />
            Oceń chatbota
          </button>
        </div>
      )}
    </>
  );
}

export default ChatbotHeader;
