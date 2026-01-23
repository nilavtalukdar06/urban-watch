"use client";

import React, { useState, useEffect } from "react";
import type { User, Channel as StreamChannel } from "stream-chat";
import {
  useCreateChatClient,
  Chat,
  Channel,
  ChannelHeader,
  MessageInput,
  MessageList,
  Window,
  OPTIONAL_MESSAGE_ACTIONS,
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";
import type { CustomMessageActions } from "stream-chat-react";

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
  const [channel, setChannel] = useState<StreamChannel>();
  const client = useCreateChatClient({
    apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY!,
    tokenOrProvider: props.token,
    userData: props.user as User,
  });

  useEffect(() => {
    if (!client) {
      return;
    }
    const channel = client.channel("messaging", {
      members: [props.user.id, props.otherUserId],
    });
    setChannel(channel);
  }, [client]);

  const deleteForMe: CustomMessageActions = {
    "Delete for me": async (message) => {
      if (!client) return;
      try {
        await client.deleteMessage(message.id, { deleteForMe: true });
      } catch (error) {
        console.error(error);
      }
    },
  };

  if (!client) {
    return (
      <div className="min-h-svh w-full h-full flex justify-center items-center p-4">
        <p className="text-lg text-muted-foreground font-light animate-pulse">
          Setting up client and connection...
        </p>
      </div>
    );
  }
  return (
    <Chat client={client}>
      <Channel channel={channel}>
        <Window>
          <ChannelHeader />
          <MessageList
            messageActions={[
              "quote",
              "edit",
              "delete",
              "react",
              OPTIONAL_MESSAGE_ACTIONS.deleteForMe,
            ]}
            customMessageActions={deleteForMe}
          />
          <MessageInput />
        </Window>
      </Channel>
    </Chat>
  );
}
