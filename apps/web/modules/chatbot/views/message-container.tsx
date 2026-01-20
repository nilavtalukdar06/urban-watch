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
import { useChat } from "@ai-sdk/react";
import { useEffect } from "react";
import { convertToUIMessage } from "../utils/ui-messages";
import {
  Message,
  MessageContent,
} from "@workspace/ui/components/ai-elements/message";
import { MessageResponse } from "@workspace/ui/components/ai-elements/message";

export function MessageContainer(props: {
  preloadedMessages: Preloaded<typeof api.functions.chatbot.getMessages>;
}) {
  const result = usePreloadedQuery(props.preloadedMessages);
  const { messages, setMessages, status, sendMessage } = useChat();
  useEffect(() => {
    setMessages(
      result.map((message) =>
        convertToUIMessage({
          id: message._id,
          role: message.role as "system" | "assistant" | "user",
          content: message.content,
          createdAt: message._creationTime,
        }),
      ),
    );
  }, [result, setMessages]);
  return (
    <section className="flex-1 flex flex-col h-full p-4">
      <Conversation className="flex flex-col flex-1 min-h-0">
        <ConversationContent>
          {messages.length === 0 ? (
            <ConversationEmptyState
              icon={<MessageSquare className="size-12" />}
              title="Start a conversation"
              description="Type a message below to begin chatting"
            />
          ) : (
            messages.map((message) => (
              <Message from={message.role} key={message.id}>
                <MessageContent>
                  {message.parts.map((part, i) => {
                    switch (part.type) {
                      case "text": // we don't use any reasoning or tool calls in this example
                        return (
                          <MessageResponse key={`${message.id}-${i}`}>
                            {part.text}
                          </MessageResponse>
                        );
                      default:
                        return null;
                    }
                  })}
                </MessageContent>
              </Message>
            ))
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
      <div>
        <PromptInput />
      </div>
    </section>
  );
}
