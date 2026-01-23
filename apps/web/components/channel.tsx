"use client";

import { useRouter } from "next/navigation";
import { ChannelSort, type User } from "stream-chat";
import {
  ChannelList,
  ChannelPreviewMessenger,
  ChannelPreviewUIComponentProps,
  Chat,
  useCreateChatClient,
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";

interface Props {
  user: User;
  token: string;
}

const customPreview = (props: ChannelPreviewUIComponentProps) => {
  const router = useRouter();
  const { channel } = props;
  const currentUserId = channel.getClient().userID;

  const handleClient = () => {
    const members = Object.values(channel.state.members);
    const otherMember = members.find((member) => {
      const memberId = member.user_id;
      return memberId !== currentUserId;
    });

    const otherMemberId = otherMember?.user_id;
    if (otherMemberId) {
      router.push(`/chat/${otherMemberId}`);
    }
  };

  return (
    <div onClick={handleClient}>
      <ChannelPreviewMessenger {...props} />
    </div>
  );
};

export function Inbox({ user, token }: Props) {
  const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!;
  const userId = user.id;
  const userToken = token;

  const filters = {
    members: { $in: [userId], type: "messaging" },
  };
  const options = {
    presence: true,
    state: true,
    limit: 10,
  };
  const sort = { last_message_at: -1 } as ChannelSort;

  const client = useCreateChatClient({
    apiKey,
    tokenOrProvider: userToken,
    userData: { id: userId },
  });

  if (!client) {
    return (
      <div className="w-full flex justify-center my-24">
        <p className="text-muted-foreground font-light animate-pulse">
          Setting Up Client...
        </p>
      </div>
    );
  }
  return (
    <div className="w-full">
      <Chat client={client}>
        <ChannelList
          filters={filters}
          options={options}
          sort={sort}
          Preview={customPreview}
          showChannelSearch={true}
        />
      </Chat>
    </div>
  );
}
