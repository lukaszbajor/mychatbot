import styles from "./Message.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot } from '@fortawesome/free-solid-svg-icons';

type MessageProps = {
	sender: "user" | "bot";
	text: string;
};

function Message({ sender, text }: MessageProps) {
	return (
		<div className={`${styles.messageContainer} ${sender === "bot" && styles.messageBotContainer}`}>
		{sender === "bot" && <div className={styles.robotContainer}><FontAwesomeIcon icon={faRobot} className={styles.robot}/></div>}
		<div
			className={`${styles.message} ${sender === "bot" && styles.botMessage}`}
		>
			<div className={styles.messageText}>
				<p>{text}</p>
			</div>
		</div>
		</div>
	);
}

export default Message;
