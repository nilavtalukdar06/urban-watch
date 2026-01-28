"use client";

import { api } from "@workspace/backend/convex/_generated/api";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { useEffect } from "react";

export function KanbanView(props: {
  preloadedTasks: Preloaded<typeof api.functions.tasks.fetchUserTasks>;
}) {
  const tasks = usePreloadedQuery(props.preloadedTasks);
  useEffect(() => {
    console.log(tasks);
  }, [tasks]);
  return (
    <div className="my-4">
      <p className="text-muted-foreground font-light">Kanban View</p>
    </div>
  );
}
