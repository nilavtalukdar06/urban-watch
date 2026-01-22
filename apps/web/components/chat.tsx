"use client";

interface Props {
  otherUserId: string;
  token: string;
  user: {
    id: string;
    name: string | null;
    image: string;
  };
}

export function Chat(props: Props) {
  return (
    <div className="w-full">
      <p className="text-muted-foreground font-light">Chat Now</p>
    </div>
  );
}
