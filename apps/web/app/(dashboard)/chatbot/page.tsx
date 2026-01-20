import { Navbar } from "@/components/shared/navbar";
import { PromptProvider } from "@/modules/chatbot/context/prompt-provider";
import { MessageContainer } from "@/modules/chatbot/views/message-container";
import { preloadQuery } from "convex/nextjs";
import { api } from "@workspace/backend/convex/_generated/api";
import { auth } from "@clerk/nextjs/server";

export default async function Chatbot() {
  const token =
    (await (await auth()).getToken({ template: "convex" })) ?? undefined;
  const result = await preloadQuery(
    api.functions.chatbot.getMessages,
    {},
    { token },
  );
  return (
    <PromptProvider>
      <div className="h-screen w-full flex flex-col">
        <Navbar />
        <MessageContainer preloadedMessages={result} />
      </div>
    </PromptProvider>
  );
}
