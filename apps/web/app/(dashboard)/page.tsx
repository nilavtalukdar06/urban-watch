import { Navbar } from "@/components/shared/navbar";
import { Links } from "@/modules/dashboard/components/links";
import { currentUser } from "@clerk/nextjs/server";
import { Button } from "@workspace/ui/components/button";
import { TriangleAlertIcon } from "lucide-react";
import { preloadQuery } from "convex/nextjs";
import { api } from "@workspace/backend/convex/_generated/api";
import { Leaderboard } from "@/modules/dashboard/components/leaderboard";
import { auth } from "@clerk/nextjs/server";

export default async function Home() {
  const user = await currentUser();
  const token =
    (await (await auth()).getToken({ template: "convex" })) ?? undefined;
  const preloadedUsers = await preloadQuery(
    api.functions.users.getUsers,
    {},
    { token },
  );
  return (
    <div>
      <Navbar />
      <div className="p-4">
        <p className="text-neutral-700 font-normal text-xl">
          Hi, {user?.firstName}
        </p>
        <p className="text text-muted-foreground font-light">
          Welcome to Urban Watch
        </p>
        <div className="my-2">
          <Button variant="green" size="sm">
            <span>Submit Report</span>
            <TriangleAlertIcon />
          </Button>
        </div>
        <div className="my-4">
          <Links />
        </div>
        <Leaderboard preloadedUsers={preloadedUsers} />
      </div>
    </div>
  );
}
