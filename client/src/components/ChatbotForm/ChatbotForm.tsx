import { useState } from "react";
import { useChat } from "../../context/ChatbotContext";
import styles from "./ChatbotForm.module.css";

function ChatForm() {
	const [input, setInput] = useState("");
	const { socket, conversationId, setMessages } = useChat();

	const handleSendMessage = () => {
		if (input.trim()) {
			console.log("Wiadomość wysłana:", input);
			socket?.emit("user_uttered", {
				session_id: conversationId,
				message: input,
			});
			setMessages((prevState) => [
				...prevState,
				{ sender: "user", text: input },
			]);
			setInput("");
		}
	};

	return (
		<div className={styles.formContainer}>
			<input
				type="text"
				value={input}
				onChange={(e) => setInput(e.target.value)}
				placeholder="Napisz wiadomość..."
				className={styles.input}
			/>
			<button onClick={handleSendMessage} className={styles.button}>
				Wyślij
			</button>
		</div>
	);
}

export default ChatForm;
