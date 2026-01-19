import { Navbar } from "@/components/shared/navbar";
import { MessageContainer } from "@/modules/chatbot/views/message-container";

export default function Chatbot() {
  return (
    <div className="h-screen w-full flex flex-col">
      <Navbar />
      <MessageContainer />
    </div>
  );
}
