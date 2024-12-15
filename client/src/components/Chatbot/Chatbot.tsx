import { useEffect, useState } from "react";
import ChatbotHeader from "../ChatHeader/ChatbotHeader";
import Messages from "../Messages/Messages";
import ChatbotForm from "../ChatbotForm/ChatbotForm";
import styles from "./Chatbot.module.css";
import { useChat } from "../../context/ChatbotContext";
import MessageSkeleton from "../MessageSkeleton/MessageSkeleton";
import { faRobot, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UnsupportedBrowserModal from "../UnsupportedBrowserModal/UnsupportedBrowserModal";

function Chatbot() {
  const [animate, setAnimate] = useState(false);
  const {
    socket,
    isOpen,
    conversationId,
    setIsOpen,
    isUnsupportedModalOpen,
    setIsUnsupportedModalOpen,
    unsupportedMessage,
    firstMessageFromBot,
    setFirstMessageFromBot,
  } = useChat();

  const toggleChat = () => {
    setIsOpen((prevState) => !prevState);
    // setFirstMessageFromBot(false);
    console.log(firstMessageFromBot, conversationId);
    if (!firstMessageFromBot) {
      setFirstMessageFromBot(true);
      socket?.emit("user_uttered", {
        message: "/get_started",
        session_id: conversationId,
      });
    }
    setFirstMessageFromBot(true);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimate(true);
      setTimeout(() => setAnimate(false), 2000);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {isOpen && (
        <div className={styles.chatbotContainer}>
          <ChatbotHeader toggleChat={toggleChat} />
          {socket?.connected ? (
            <Messages />
          ) : (
            <>
              <MessageSkeleton />
              <MessageSkeleton />
              <MessageSkeleton />
            </>
          )}
          <ChatbotForm />
        </div>
      )}
      <button className={styles.toggleButton} onClick={toggleChat}>
        {isOpen ? (
          <FontAwesomeIcon icon={faX} />
        ) : (
          <FontAwesomeIcon
            icon={faRobot}
            className={`${styles.robot} ${animate ? styles.robotSpin : ""}`}
          />
        )}
      </button>
      {isUnsupportedModalOpen && unsupportedMessage && (
        <UnsupportedBrowserModal
          onClose={() => {
            setIsUnsupportedModalOpen(false);
          }}
        >
          {unsupportedMessage}
        </UnsupportedBrowserModal>
      )}
    </>
  );
}

export default Chatbot;
