import { StreamChat } from "stream-chat";

export const stream = StreamChat.getInstance(
  process.env.STREAM_API_KEY!,
  process.env.STREAM_API_SECRET!,
);

export const upsertUser = async (userId: string, name: string) => {
  const result = await stream.upsertUser({
    id: userId,
    name,
    image: "https://getstream.io/random_png/?id=" + userId,
  });
  return result;
};
