import { KanbanView } from "@/modules/tasks/views/kanban-view";
import { auth } from "@clerk/nextjs/server";
import { api } from "@workspace/backend/convex/_generated/api";
import { preloadQuery } from "convex/nextjs";

export default async function MyTasks() {
  const user = await auth();
  const token = (await user.getToken({ template: "convex" })) ?? undefined;
  const preloadedTasks = await preloadQuery(
    api.functions.tasks.fetchUserTasks,
    {},
    { token },
  );
  return (
    <div className="px-4 pb-4">
      <p className="text-lg text-neutral-600 font-light">My Tasks</p>
      <p className="text-muted-foreground font-light text-sm">
        Manage all of your tasks here
      </p>
      <KanbanView preloadedTasks={preloadedTasks} />
    </div>
  );
}
