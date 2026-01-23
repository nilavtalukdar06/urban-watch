"use client";

import { type User } from "stream-chat";

interface Props {
  user: User;
  token: string;
}

export function ChannelList({ user, token }: Props) {
  return (
    <div className="w-full">
      <p className="text-muted-foreground font-light">Channels List</p>
    </div>
  );
}
