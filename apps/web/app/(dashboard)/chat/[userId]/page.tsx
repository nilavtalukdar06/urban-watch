import { Chat } from "@/components/chat";
import { generateToken } from "@/lib/stream";
import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ userId: string }>;
}

type ChatToken = {
  token: string;
  user: {
    id: string;
    name: string | null;
    image: string;
  };
};

export default async function ChatPage({ params }: Props) {
  const { userId } = await params;
  let token: ChatToken;
  try {
    const result = await generateToken();
    token = result;
  } catch (error) {
    console.error(error);
    redirect("/");
  }
  return (
    <div className="p-4">
      <Chat token={token.token} user={token.user} otherUserId={userId} />
    </div>
  );
}
