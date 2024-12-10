import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";

interface Message {
  sender: "bot" | "user";
  text: string;
}
interface ChatContextType {
  socket: Socket | null;
  conversationId: string | null;
  messages: Message[];
  isOpen: boolean;
  isUnsupportedModalOpen: boolean;
  isVoiceReadingEnabled: boolean; // Nowa opcja
  isVoiceInputEnabled: boolean; // Nowa opcja
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setConversationId: React.Dispatch<React.SetStateAction<string | null>>;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsUnsupportedModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isSpeechRecognitionSupported: boolean;
  isSpeechSynthesisSupported: boolean;
  showUnsupportedModal: (message: string) => void;
  closeUnsupportedModal: () => void;
  unsupportedMessage: string | null;
  setIsVoiceReadingEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsVoiceInputEnabled: React.Dispatch<React.SetStateAction<boolean>>;
}

// eslint-disable-next-line react-refresh/only-export-components
const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isUnsupportedModalOpen, setIsUnsupportedModalOpen] =
    useState<boolean>(false);
  const [unsupportedMessage, setUnsupportedMessage] = useState<string | null>(
    null
  );
  const [isVoiceReadingEnabled, setIsVoiceReadingEnabled] = useState(true);
  const [isVoiceInputEnabled, setIsVoiceInputEnabled] = useState(true);

  const isSpeechRecognitionSupported =
    "SpeechRecognition" in window || "webkitSpeechRecognition" in window;
  const isSpeechSynthesisSupported = "speechSynthesis" in window;

  const showUnsupportedModal = (message: string) => {
    setUnsupportedMessage(message);
    setIsUnsupportedModalOpen(true);
  };

  const closeUnsupportedModal = () => {
    setUnsupportedMessage(null);
    setIsUnsupportedModalOpen(false);
  };

  // Inicjalizacja WebSocket
  useEffect(() => {
    const sio = io("http://localhost:5000"); // Adres serwera WebSocket

    setSocket(sio);

    sio.on("connect", () => {
      console.log("WebSocket connected");
      sio.emit("session_request", { conversation_id: conversationId });
    });
    sio.on("session_confirm", (data) => {
      const { conversation_id: conversationId } = data;
      setConversationId(conversationId);
      sio.emit("user_uttered", {
        message: "/get_started",
        session_id: conversationId,
      });
    });
    sio.on("bot_uttered", (data: { text: string }) => {
      setMessages((prevState) => [
        ...prevState,
        { sender: "bot", text: data.text },
      ]);
    });

    // sio.on("disconnect", () => {
    // 	console.log("WebSocket disconnected");
    // 	// setConnected(false);
    // });

    // sio.on("bot_uttered", (data: { text: string }) => {
    // setMessages((prev) => [...prev, { sender: "bot", text: data.text }]);
    // });

    return () => {
      sio.disconnect();
    };
  }, []);

  return (
    <ChatContext.Provider
      value={{
        socket,
        conversationId,
        messages,
        isOpen,
        isUnsupportedModalOpen,
        isVoiceReadingEnabled,
        isVoiceInputEnabled,
        setMessages,
        setConversationId,
        setIsOpen,
        setIsUnsupportedModalOpen,
        isSpeechRecognitionSupported,
        isSpeechSynthesisSupported,
        showUnsupportedModal,
        closeUnsupportedModal,
        unsupportedMessage,
        setIsVoiceReadingEnabled,
        setIsVoiceInputEnabled,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// Hook do używania kontekstu w innych komponentach
export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
