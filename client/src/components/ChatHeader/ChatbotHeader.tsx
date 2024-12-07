import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRobot,
  faX,
  faEllipsisVertical,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./ChatbotHeader.module.css";

interface ChatbotHeaderProps {
  toggleChat: () => void;
}

function ChatbotHeader({ toggleChat }: ChatbotHeaderProps) {
  return (
    <div className={styles.header}>
      <h3 className={styles.title}>
        Wirtualny asystent <FontAwesomeIcon icon={faRobot} />
      </h3>
      <div>
        <button className={styles.closeButton}>
          <FontAwesomeIcon icon={faEllipsisVertical} />
        </button>
        <button className={styles.closeButton} onClick={toggleChat}>
          <FontAwesomeIcon icon={faX} />
        </button>
      </div>
    </div>
  );
}

export default ChatbotHeader;
