import { useEffect, useRef } from "react";
import { useChat } from "../../context/ChatbotContext";
import Message from "../Message/Message";

import styles from "./Messages.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot, faVolumeUp } from "@fortawesome/free-solid-svg-icons";
import MessageLoader from "../MessageLoader/MessageLoader";
import SurveyForm from "../SurveyForm/SurveyForm";

const Messages = () => {
  const { messages, isTyping, isShowSurveyForm } = useChat();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      // messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
      messagesEndRef.current.scrollTo({
        top: messagesEndRef.current.scrollHeight,
        behavior: "smooth",
      });
      // .scrollIntoView({
      //   behavior: "smooth",
      //   block: "end",
      // });
    }
  };

  useEffect(() => {
    // const timer = setTimeout(() => {
    scrollToBottom(); // Wywołujemy przewijanie po załadowaniu nowych wiadomości
    // }, 2600);

    // return () => clearTimeout(timer);
  }, [messages, isTyping]); // Zmieniamy w zależności od zmian w messages

  return (
    <div className={styles.messagesContainer} ref={messagesEndRef}>
      {!isShowSurveyForm &&
        messages.map((message, index) => (
          <Message
            key={index}
            sender={message.sender}
            text={message.text}
            // prevSender={index > 0 ? messages[index - 1].sender : undefined}
          />
        ))}
      {isTyping && (
        <div className={styles.typingContainer}>
          {" "}
          <div className={styles.robotContainer}>
            <FontAwesomeIcon icon={faRobot} className={styles.robot} />
          </div>
          <MessageLoader />
        </div>
      )}
      {isShowSurveyForm && <SurveyForm />}
      {/* <div className={styles.scroll} ></div> */}
    </div>
  );
};

export default Messages;
