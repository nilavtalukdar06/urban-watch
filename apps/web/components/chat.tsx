"use client";

import { useState, useEffect } from "react";
import type { User, Channel as StreamChannel } from "stream-chat";
import {
  useCreateChatClient,
  Chat,
  Channel,
  ChannelHeader,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";

interface Props {
  otherUserId: string;
  token: string;
  user: {
    id: string;
    name: string | null;
    image: string;
  };
}

export function ChatComponent(props: Props) {
  return (
    <div className="w-full">
      <p className="text-muted-foreground font-light">Chat Now</p>
    </div>
  );
}
