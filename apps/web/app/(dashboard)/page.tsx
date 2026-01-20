import { Navbar } from "@/components/shared/navbar";
import { currentUser } from "@clerk/nextjs/server";

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
      </div>
    </div>
  );
}
