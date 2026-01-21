import { Navbar } from "@/components/shared/navbar";
import { Links } from "@/modules/dashboard/components/links";
import { currentUser } from "@clerk/nextjs/server";
import { Button } from "@workspace/ui/components/button";
import { Plus } from "lucide-react";

export default async function Home() {
  const user = await currentUser();
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
            <Plus />
          </Button>
        </div>
        <div className="my-4">
          <Links />
        </div>
      </div>
    </div>
  );
}
