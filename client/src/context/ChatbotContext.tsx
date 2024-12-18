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
  quick_replies?: { title: string; payload: string }[];
}
interface ChatContextType {
  socket: Socket | null;
  conversationId: string | null;
  messages: Message[];
  isOpen: boolean;
  isUnsupportedModalOpen: boolean;
  isVoiceReadingEnabled: boolean;
  isVoiceInputEnabled: boolean;
  isTyping: boolean;
  firstMessageFromBot: boolean;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setConversationId: React.Dispatch<React.SetStateAction<string | null>>;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsUnsupportedModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isSpeechRecognitionSupported: boolean;
  isSpeechSynthesisSupported: boolean;
  isShowSurveyForm: boolean;
  showUnsupportedModal: (message: string) => void;
  closeUnsupportedModal: () => void;
  unsupportedMessage: string | null;
  setIsVoiceReadingEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsVoiceInputEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>;
  setFirstMessageFromBot: React.Dispatch<React.SetStateAction<boolean>>;
  setIsShowSurveyForm: React.Dispatch<React.SetStateAction<boolean>>;
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
  const [isTyping, setIsTyping] = useState(false);

  const [queue, setQueue] = useState<Message[]>([]);

  const [firstMessageFromBot, setFirstMessageFromBot] = useState(false);
  const [isShowSurveyForm, setIsShowSurveyForm] = useState(false);

  const showUnsupportedModal = (message: string) => {
    setUnsupportedMessage(message);
    setIsUnsupportedModalOpen(true);
  };

  const closeUnsupportedModal = () => {
    setUnsupportedMessage(null);
    setIsUnsupportedModalOpen(false);
  };

  useEffect(() => {
    setFirstMessageFromBot(true);
    const sio = io("https://mychatbot-p3tg.onrender.com", {
      path: "/socket.io",
    });

    // "http://localhost:5000"

    setSocket(sio);

    sio.on("connect", () => {
      console.log("WebSocket connected");
      sio.emit("session_request", { conversation_id: conversationId });
      console.log(`Session_confirm: ${conversationId}`);
    });

    sio.on("session_confirm", (data) => {
      const { conversation_id: conversationId } = data;
      setConversationId(conversationId);
      setFirstMessageFromBot(false);

      console.log(`Session_confirm2: ${conversationId}`);
    });

    sio.on(
      "bot_uttered",
      (data: {
        quick_replies: { title: string; payload: string }[] | undefined;
        text: string;
      }) => {
        setQueue((prevState) => {
          if (
            !prevState.find(
              (msg) => msg.text === data.text && msg.sender === "bot"
            )
          ) {
            return [
              ...prevState,
              {
                sender: "bot",
                text: data.text,
                quick_replies: data.quick_replies,
              },
            ];
          }
          return prevState;
        });

        setIsTyping(true);
      }
    );

    return () => {
      sio.disconnect();
    };
  }, []);

  useEffect(() => {
    console.log("WebSocket połączony. Rozpoczynamy sesję...");
    socket?.emit("session_request", { conversation_id: null });
  }, []);

  useEffect(() => {
    if (queue.length > 0) {
      const timer = setTimeout(() => {
        setMessages((prevState) => [...prevState, queue[0]]);
        setQueue((prevState) => prevState.slice(1));
      }, 2500);

      return () => clearTimeout(timer);
    } else {
      setIsTyping(false);
    }
    console.log(messages);
  }, [queue]);

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
        isTyping,
        isShowSurveyForm,
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
        setIsTyping,
        firstMessageFromBot,
        setFirstMessageFromBot,
        setIsShowSurveyForm,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
