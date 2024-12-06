import { useEffect, useRef } from "react";
import { useChat } from "../../context/ChatbotContext";
import Message from "../Message/Message";

import styles from "./Messages.module.css";

const Messages = () => {
	const { messages } = useChat();
	const messagesEndRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
		}
	}, [messages]);

	return (
		<div className={styles.messagesContainer} ref={messagesEndRef}>
			{messages.map((message, index) => (
				<Message key={index} sender={message.sender} text={message.text} />
			))}
		</div>
	);
};

export default Messages;
