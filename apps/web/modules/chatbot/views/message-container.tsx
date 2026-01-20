"use client";

import { MessageSquare } from "lucide-react";
import { PromptInput } from "../components/prompt-input";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@workspace/ui/components/ai-elements/conversation";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "@workspace/backend/convex/_generated/api";

export function MessageContainer(props: {
  preloadedMessages: Preloaded<typeof api.functions.chatbot.getMessages>;
}) {
  const messages = usePreloadedQuery(props.preloadedMessages);
  return (
    <section className="flex-1 flex flex-col h-full p-4">
      <Conversation className="flex flex-col flex-1 min-h-0">
        <ConversationContent>
          <ConversationEmptyState
            icon={<MessageSquare className="size-12" />}
            title="Start a conversation"
            description="Type a message below to begin chatting"
          />
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
      <div>
        <PromptInput />
      </div>
    </section>
  );
}
