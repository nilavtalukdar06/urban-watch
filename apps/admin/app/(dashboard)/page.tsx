import { CreateTask } from "@/modules/tasks/components/create-task";

export default async function Home() {
  return (
    <div className="px-4 pb-4">
      <h3 className="text-lg text-neutral-600 font-light">
        Task Management Dashboard
      </h3>
      <p className="text-muted-foreground font-light text-sm">
        Create and manage all of your tasks here
      </p>
      <CreateTask />
    </div>
  );
}
