import Chatbot from "./components/Chatbot/Chatbot";
import { ChatProvider } from "./context/ChatbotContext";

function App() {
	return (
		<ChatProvider>
			<Chatbot />
		</ChatProvider>
	);
}

export default App;
