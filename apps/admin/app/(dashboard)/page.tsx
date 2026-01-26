import { CreateTask } from "@/modules/tasks/components/create-task";
import { CalendarView } from "@/modules/tasks/views/calendar-view";
import { auth } from "@clerk/nextjs/server";
import { api } from "@workspace/backend/convex/_generated/api";
import { preloadQuery } from "convex/nextjs";

export default async function Home() {
  const { has } = await auth();
  const token =
    (await (await auth()).getToken({ template: "convex" })) ?? undefined;
  const preloadedTasks = await preloadQuery(api.functions.tasks.getTasks, {}, { token });
  return (
    <div className="px-4 pb-4 w-full">
      <h3 className="text-lg text-neutral-600 font-light">
        Task Management Dashboard
      </h3>
      <p className="text-muted-foreground font-light text-sm">
        Create and manage all of your tasks here
      </p>
      {has({ role: "org:admin" }) && <CreateTask />}
      <CalendarView preloadedTasks={preloadedTasks} />
    </div>
  );
}
