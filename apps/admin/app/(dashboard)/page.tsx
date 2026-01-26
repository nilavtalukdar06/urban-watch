import { CreateTask } from "@/modules/tasks/components/create-task";
import { auth } from "@clerk/nextjs/server";

export default async function Home() {
  const { has } = await auth();
  return (
    <div className="px-4 pb-4">
      <h3 className="text-lg text-neutral-600 font-light">
        Task Management Dashboard
      </h3>
      <p className="text-muted-foreground font-light text-sm">
        Create and manage all of your tasks here
      </p>
      {has({ role: "org:admin" }) && <CreateTask />}
    </div>
  );
}
