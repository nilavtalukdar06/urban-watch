import type { UIMessage } from "ai";

export interface ExtendedUIMessage extends UIMessage {
  metadata: {
    createdAt: number;
  };
}

interface Message {
  id: string;
  role: "system" | "assistant" | "user";
  content: string;
  createdAt: number;
}

export const convertToUIMessage = (message: Message): ExtendedUIMessage => {
  return {
    id: message.id,
    role: message.role,
    parts: [{ type: "text", text: message.content }],
    metadata: {
      createdAt: message.createdAt,
    },
  };
};
