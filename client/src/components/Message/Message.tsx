import styles from "./Message.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot, faVolumeUp } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

import { removeHtmlTags } from "../../utils/removeHtmlTags";
import { useChat } from "../../context/ChatbotContext";

type MessageProps = {
  sender: "user" | "bot";
  text: string;
  quick_replies?: { title: string; payload: string }[];
  prevSender?: "user" | "bot";
};

function Message({ sender, text, quick_replies }: MessageProps) {
  const [showMessage, setShowMessage] = useState(sender !== "bot");
  const [activeSyntezor, setActiveSyntezor] = useState(false);
  const {
    socket,
    conversationId,
    isSpeechSynthesisSupported,
    showUnsupportedModal,
    isVoiceReadingEnabled,
  } = useChat();

  useEffect(() => {
    if (sender === "bot") {
      const timer = setTimeout(() => setShowMessage(true), 2500);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [sender]);

  const handleReadMessage = () => {
    if (activeSyntezor) {
      window.speechSynthesis.cancel();
      setActiveSyntezor(false);
      return;
    }
    if ("speechSynthesis" in window && isSpeechSynthesisSupported) {
      let cleanText = removeHtmlTags(text);
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = "pl-PL";
      window.speechSynthesis.speak(utterance);
      setActiveSyntezor(true);
      utterance.onend = () => {
        setActiveSyntezor(false);
      };
    } else {
      showUnsupportedModal(
        "Twoja przeglądarka nie obsługuje syntezatora mowy."
      );
    }
  };

  return (
    <div
      className={`${styles.messageContainer} ${
        sender === "bot" && styles.messageBotContainer
      }`}
    >
      {sender === "bot" && (
        <div className={styles.robotContainer}>
          <FontAwesomeIcon icon={faRobot} className={styles.robot} />
        </div>
      )}
      <div
        className={`${styles.message} ${sender === "bot" && styles.botMessage}`}
      >
        <div
          className={`${styles.messageText} ${
            quick_replies && styles.messageTextWithBtns
          }`}
        >
          <p dangerouslySetInnerHTML={{ __html: text }}></p>
          <div className={styles.messageButtons}>
            {quick_replies?.map((button, idx) => (
              <button
                key={idx}
                className={styles.button}
                onClick={() => {
                  socket?.emit("user_uttered", {
                    session_id: conversationId,
                    message: button.title,
                  });
                }}
              >
                {button.title}
              </button>
            ))}
          </div>
          {sender === "bot" && isVoiceReadingEnabled && (
            <button
              onClick={handleReadMessage}
              className={`${styles.readMessageButton} ${
                activeSyntezor ? styles.active : ``
              }`}
              title="Odczytaj wiadomość."
            >
              <FontAwesomeIcon icon={faVolumeUp} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Message;
