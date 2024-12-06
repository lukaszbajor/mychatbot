import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot, faX } from '@fortawesome/free-solid-svg-icons';
import styles from "./ChatbotHeader.module.css";

interface ChatbotHeaderProps {
	toggleChat: () => void;
}

function ChatbotHeader({ toggleChat }: ChatbotHeaderProps) {
	return (
		<div className={styles.header}>
			<h3 className={styles.title}>Wirtualny asystent <FontAwesomeIcon icon={faRobot} /></h3>
			<button className={styles.closeButton} onClick={toggleChat}>
			<FontAwesomeIcon icon={faX} />
			</button>
		</div>
	);
}

export default ChatbotHeader;
