"use client";

import { api } from "@workspace/backend/convex/_generated/api";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { useEffect } from "react";

export function CalendarView(props: {
  preloadedTasks: Preloaded<typeof api.functions.tasks.getTasks>;
}) {
  const tasks = usePreloadedQuery(props.preloadedTasks);
  useEffect(() => {
    if (tasks) console.log(tasks);
  }, [tasks]);
  return (
    <div className="my-3">
      <p className="text-muted-foreground font-light">Calendar View</p>
    </div>
  );
}
