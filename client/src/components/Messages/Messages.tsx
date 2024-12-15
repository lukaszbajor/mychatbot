import { useEffect, useRef } from "react";
import { useChat } from "../../context/ChatbotContext";
import Message from "../Message/Message";

import styles from "./Messages.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot } from "@fortawesome/free-solid-svg-icons";
import MessageLoader from "../MessageLoader/MessageLoader";
import SurveyForm from "../SurveyForm/SurveyForm";

const Messages = () => {
  const { messages, isTyping, isShowSurveyForm } = useChat();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTo({
        top: messagesEndRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  return (
    <div className={styles.messagesContainer} ref={messagesEndRef}>
      {!isShowSurveyForm &&
        messages.map((message, index) => (
          <Message key={index} sender={message.sender} text={message.text} />
        ))}
      {isTyping && (
        <div className={styles.typingContainer}>
          <div className={styles.robotContainer}>
            <FontAwesomeIcon icon={faRobot} className={styles.robot} />
          </div>
          <MessageLoader />
        </div>
      )}
      {isShowSurveyForm && <SurveyForm />}
    </div>
  );
};

export default Messages;
