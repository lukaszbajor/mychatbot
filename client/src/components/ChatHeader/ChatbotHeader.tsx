import styles from "./ChatbotHeader.module.css";

interface ChatbotHeaderProps {
	toggleChat: () => void;
}

function ChatbotHeader({ toggleChat }: ChatbotHeaderProps) {
	return (
		<div className={styles.header}>
			<h3 className={styles.title}>Chatbot</h3>
			<button className={styles.closeButton} onClick={toggleChat}>
				X
			</button>
		</div>
	);
}

export default ChatbotHeader;
