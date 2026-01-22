import { currentUser } from "@clerk/nextjs/server";
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

export const generateToken = async () => {
  "use server";
  const user = await currentUser();
  if (!user) {
    throw new Error("the user is not authenticated");
  }
  const token = stream.createToken(user.id);
  return {
    token,
    user: {
      id: user.id,
      name: user.fullName,
      image: "https://getstream.io/random_png/?id=" + user.id,
    },
  };
};
