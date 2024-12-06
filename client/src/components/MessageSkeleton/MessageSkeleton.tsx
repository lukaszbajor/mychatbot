import styles from "./MessageSkeleton.module.css";

const MessageSkeleton = () => {
	return (
		<div className={styles.messageSkeleton}>
			<div className={styles.avatar}></div>
			<div className={styles.content}>
				<div className={`${styles.line} ${styles.short}`}></div>
				<div className={styles.line}></div>
				<div className={styles.line}></div>
			</div>
		</div>
	);
};

export default MessageSkeleton;
