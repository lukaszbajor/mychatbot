import styles from "./Message.module.css";

type MessageProps = {
	sender: "user" | "bot";
	text: string;
};

function Message({ sender, text }: MessageProps) {
	return (
		<div
			className={`${styles.message} ${sender === "bot" && styles.botMessage}`}
		>
			<div className={styles.messageText}>
				<p>{text}</p>
			</div>
		</div>
	);
}

export default Message;
