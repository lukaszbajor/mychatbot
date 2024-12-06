import { useState } from "react";
import ChatbotHeader from "../ChatHeader/ChatbotHeader";
import Messages from "../Messages/Messages";
import ChatbotForm from "../ChatbotForm/ChatbotForm";

import styles from "./Chatbot.module.css";
import { useChat } from "../../context/ChatbotContext";
// import MessageLoader from "../MessageLoader/MessageLoader";
import MessageSkeleton from "../MessageSkeleton/MessageSkeleton";

function Chatbot() {
	const [isOpen, setIsOpen] = useState(false);
	const { socket, messages } = useChat();

	const toggleChat = () => setIsOpen((prevState) => !prevState);

	return (
		<>
			{isOpen && (
				<div className={styles.chatbotContainer}>
					<ChatbotHeader toggleChat={toggleChat} />
					{socket?.connected && messages.length !== 0 ? (
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
				{isOpen ? "X" : "Otwórz Chat"}
			</button>
		</>
	);
}

export default Chatbot;
