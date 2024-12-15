import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRobot,
  faX,
  faEllipsisVertical,
  faTrashCan,
  faVolumeUp,
  faMicrophone,
  faStar,
  faFilePdf,
  faMicrophoneSlash,
  faVolumeXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useChat } from "../../context/ChatbotContext";
import styles from "./ChatbotHeader.module.css";
import { useEffect, useRef, useState } from "react";
import exportToPDF from "../../utils/exportToPDF";

interface ChatbotHeaderProps {
  toggleChat: () => void;
}

function ChatbotHeader({ toggleChat }: ChatbotHeaderProps) {
  const [moreBtnsIsOpen, setMoreBtnsIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const {
    setMessages,
    socket,
    messages,
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

  const handleOutsideClick = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setMoreBtnsIsOpen(false);
    }
  };

  function handleDisconnectChat() {
    setFirstMessageFromBot(true);
    if (socket) {
      socket.disconnect();
      console.log("Disconnected from chat");

      setMessages([]);
      setConversationId(null);

      socket.connect();
      console.log("Reconnected to chat");
    }

    setMoreBtnsIsOpen(false);
    setIsOpen(false);
  }

  useEffect(() => {
    if (moreBtnsIsOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [moreBtnsIsOpen]);

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
        <div className={styles.moreBtns} ref={menuRef}>
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
            <FontAwesomeIcon
              icon={isVoiceReadingEnabled ? faVolumeXmark : faVolumeUp}
            />
            {isVoiceReadingEnabled ? "Wyłącz czytanie" : "Włącz czytanie"}
          </button>
          <button
            className={styles.optionBtn}
            onClick={() => {
              setIsVoiceInputEnabled((prev: any) => !prev);
              setMoreBtnsIsOpen(!moreBtnsIsOpen);
            }}
          >
            <FontAwesomeIcon
              icon={isVoiceInputEnabled ? faMicrophoneSlash : faMicrophone}
            />
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
          <button
            className={styles.optionBtn}
            onClick={() => {
              exportToPDF(messages);
              setMoreBtnsIsOpen(!moreBtnsIsOpen);
            }}
          >
            <FontAwesomeIcon icon={faFilePdf} />
            Zapisz rozmowę w PDF
          </button>
        </div>
      )}
    </>
  );
}

export default ChatbotHeader;
