import { useState } from "react";
import { useChat } from "../../context/ChatbotContext";
import styles from "./ChatbotForm.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faMicrophone } from "@fortawesome/free-solid-svg-icons";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

function ChatForm() {
  const [input, setInput] = useState("");
  const {
    socket,
    conversationId,
    setMessages,
    setIsUnsupportedModalOpen,
    showUnsupportedModal,
    isVoiceInputEnabled,
  } = useChat();

  const [isListening, setIsListening] = useState(false);

  //mowa na tekst

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  if (recognition) {
    recognition.lang = "pl-PL"; // Ustaw język na polski
    recognition.continuous = false;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput((prevInput) => prevInput + " " + transcript); // Dodaj przetłumaczoną mowę do inputu
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  }

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

  const handleClickEnterToSend = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Zapobiega dodaniu nowej linii w `<textarea>`
      handleSendMessage();
    }
  };

  const handleStartListening = () => {
    if (recognition) {
      setIsListening(true);
      recognition.start();
    } else {
      // alert("Twoja przeglądarka nie obsługuje rozpoznawania mowy.");
      setIsUnsupportedModalOpen(true);
      showUnsupportedModal(
        "Twoja przeglądarka nie obsługuje funkcji rozpoznawania mowy."
      );
    }
  };

  return (
    <div className={styles.formContainer}>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleClickEnterToSend}
        placeholder="Napisz wiadomość..."
        className={styles.textValue}
      />
      <div className={styles.btns}>
        {isVoiceInputEnabled && (
          <button
            onClick={handleStartListening}
            className={`${styles.button} ${styles.buttonMicro} ${
              isListening ? styles.active : ""
            }`}
            title="Nagraj wiadomość."
          >
            <FontAwesomeIcon icon={faMicrophone} />
          </button>
        )}
        <button onClick={handleSendMessage} className={styles.button}>
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </div>
    </div>
  );
}

export default ChatForm;
