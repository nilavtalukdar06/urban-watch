import { Navbar } from "@/components/shared/navbar";
import { PromptProvider } from "@/modules/chatbot/context/prompt-provider";
import { MessageContainer } from "@/modules/chatbot/views/message-container";

export default function Chatbot() {
  return (
    <PromptProvider>
      <div className="h-screen w-full flex flex-col">
        <Navbar />
        <MessageContainer />
      </div>
    </PromptProvider>
  );
}
