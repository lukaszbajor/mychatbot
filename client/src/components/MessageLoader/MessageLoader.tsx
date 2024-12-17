import styles from "./MessageLoader.module.css"; 

const MessageLoader = () => {
	return (
		<div className={styles.messageLoader}>
			<div className={styles.messageLoaderBubble}></div>
			<div className={styles.messageLoaderBubble}></div>
			<div className={styles.messageLoaderBubble}></div>
		</div>
	);
};

export default MessageLoader;
