import { Inbox } from "@/components/channel";
import { Navbar } from "@/components/shared/navbar";
import { generateToken } from "@/lib/stream";
import { redirect } from "next/navigation";
import { User } from "stream-chat";

export default async function InboxPage() {
  const result = await generateToken();
  if (!result) {
    redirect("/");
  }
  return (
    <div className="w-full">
      <Navbar />
      <div className="p-4 w-full">
        <Inbox user={result.user as User} token={result.token} />
      </div>
    </div>
  );
}
