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
import { Shimmer } from "@workspace/ui/components/ai-elements/shimmer";
import {
  Message,
  MessageContent,
} from "@workspace/ui/components/ai-elements/message";
import { MessageResponse } from "@workspace/ui/components/ai-elements/message";
import { cn } from "@workspace/ui/lib/utils";

export function MessageContainer(props: {
  preloadedMessages: Preloaded<typeof api.functions.chatbot.getMessages>;
}) {
  const result = usePreloadedQuery(props.preloadedMessages);
  const { messages, setMessages, status, sendMessage } = useChat();
  useEffect(() => {
    setMessages(
      result
        .map((message) =>
          convertToUIMessage({
            id: message._id,
            role: message.role as "system" | "assistant" | "user",
            content: message.content,
            createdAt: message._creationTime,
          }),
        )
        .reverse(),
    );
  }, [result, setMessages]);
  return (
    <section className="flex flex-col overflow-y-auto flex-1">
      <Conversation className="flex flex-col flex-1">
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
                      case "text":
                        return (
                          <MessageResponse
                            key={`${message.id}-${i}`}
                            className={cn(
                              message.role === "assistant" &&
                                "text-muted-foreground font-light",
                            )}
                          >
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
          {status === "submitted" && (
            <div className="flex flex-col items-start justify-center gap-y-2">
              <Shimmer duration={1} className="font-light text-sm">
                Thinking...
              </Shimmer>
            </div>
          )}
          {status === "error" && (
            <div className="flex flex-col items-start justify-center gap-y-2">
              <p className="text-sm text-red-500 font-light">
                Failed to fulfill your request, please try again later.
              </p>
            </div>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
      <div className="px-4 py-3">
        <PromptInput sendMessage={sendMessage} status={status} />
      </div>
    </section>
  );
}
