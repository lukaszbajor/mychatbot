import styles from "./Message.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot, faVolumeUp } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import MessageLoader from "../MessageLoader/MessageLoader";
import { useChat } from "../../context/ChatbotContext";

type MessageProps = {
  sender: "user" | "bot";
  text: string;
};

function Message({ sender, text }: MessageProps) {
  const [showMessage, setShowMessage] = useState(sender !== "bot");
  const [activeSyntezor, setActiveSyntezor] = useState(false);
  const {
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
    if ("speechSynthesis" in window && isSpeechSynthesisSupported) {
      const utterance = new SpeechSynthesisUtterance(text);
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

  if (!showMessage && sender === "bot") {
    return <MessageLoader />;
  }

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
        <div className={styles.messageText}>
          <p>{text}</p>
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
