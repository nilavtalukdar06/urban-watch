"use client";

import { api } from "@workspace/backend/convex/_generated/api";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { useEffect, useMemo, useState } from "react";
import { GripVertical } from "lucide-react";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Kanban,
  KanbanBoard,
  KanbanColumn,
  KanbanColumnHandle,
  KanbanItem,
  KanbanOverlay,
} from "@workspace/ui/components/kanban";
import { format } from "date-fns";
import { useMutation } from "convex/react";

interface KanbanTask {
  id: string;
  title: string;
  description: string;
  assignee?: string;
  dueDate?: string;
}

type ColumnKey = "pending" | "in_progress" | "completed" | "cancelled";

const COLUMN_TITLES: Record<ColumnKey, string> = {
  pending: "Pending",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

export function KanbanView(props: {
  preloadedTasks: Preloaded<typeof api.functions.tasks.fetchUserTasks>;
}) {
  const updateTaskStatus = useMutation(api.functions.tasks.updateTaskStatus);
  const tasks = usePreloadedQuery(props.preloadedTasks);
  const initialColumns = useMemo<Record<ColumnKey, KanbanTask[]>>(
    () => ({
      pending: [],
      in_progress: [],
      completed: [],
      cancelled: [],
    }),
    [],
  );
  const [columns, setColumns] =
    useState<Record<ColumnKey, KanbanTask[]>>(initialColumns);
  useEffect(() => {
    if (!tasks) return;
    const nextColumns: Record<ColumnKey, KanbanTask[]> = {
      pending: [],
      in_progress: [],
      completed: [],
      cancelled: [],
    };
    for (const task of tasks) {
      nextColumns[task.status].push({
        id: task._id,
        title: task.title,
        description: task.description,
        assignee: task.assigneeName,
        dueDate: task.dueDate
          ? format(new Date(task.dueDate), "dd MMM")
          : undefined,
      });
    }
    setColumns(nextColumns);
  }, [tasks]);

  const handleKanbanChange = async (
    nextColumns: Record<ColumnKey, KanbanTask[]>,
  ) => {
    const prevColumns = columns;
    for (const fromColumn of Object.keys(prevColumns) as ColumnKey[]) {
      const prevTasks = prevColumns[fromColumn];
      const nextTasks = nextColumns[fromColumn];

      if (prevTasks.length === nextTasks.length) continue;
      const movedTask = prevTasks.find(
        (task) => !nextTasks.some((t) => t.id === task.id),
      );
      if (!movedTask) continue;
      const toColumn = (Object.keys(nextColumns) as ColumnKey[]).find((col) =>
        nextColumns[col].some((t) => t.id === movedTask.id),
      );
      if (!toColumn || toColumn === fromColumn) continue;
      setColumns(nextColumns);

      try {
        await updateTaskStatus({
          taskId: movedTask.id as any,
          status: toColumn,
        });
      } catch (error) {
        console.error("Failed to update task status", error);
        setColumns(prevColumns);
      }
      return;
    }
    setColumns(nextColumns);
  };

  return (
    <div className="my-4 w-full">
      <Kanban
        value={columns}
        onValueChange={handleKanbanChange}
        getItemValue={(item) => item.id}
      >
        <KanbanBoard className="grid auto-rows-fr sm:grid-cols-4">
          {(Object.keys(columns) as ColumnKey[]).map((columnKey) => {
            const columnTasks = columns[columnKey];
            return (
              <KanbanColumn
                key={columnKey}
                value={columnKey}
                className="rounded-none p-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-normal text-base text-neutral-700">
                      {COLUMN_TITLES[columnKey]}
                    </span>
                    <Badge
                      variant="secondary"
                      className="pointer-events-none rounded-sm"
                    >
                      {columnTasks.length}
                    </Badge>
                  </div>
                  <KanbanColumnHandle asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-none"
                    >
                      <GripVertical className="h-4 w-4" />
                    </Button>
                  </KanbanColumnHandle>
                </div>
                <div className="flex flex-col gap-2 p-0.5">
                  {columnTasks.map((task) => (
                    <KanbanItem key={task.id} value={task.id} asHandle asChild>
                      <div className="rounded-none border bg-card p-3">
                        <div className="flex flex-col gap-2">
                          <span className="line-clamp-1 font-normal text-sm">
                            {task.title}
                          </span>
                          {task.description && (
                            <p className="line-clamp-2 font-light text-xs text-muted-foreground">
                              {task.description}
                            </p>
                          )}
                          <div className="flex items-center justify-between text-muted-foreground text-xs">
                            {task.assignee && (
                              <div className="flex items-center gap-1">
                                <div className="size-2 rounded-full bg-primary/20" />
                                <span className="line-clamp-1 font-light">
                                  {task.assignee}
                                </span>
                              </div>
                            )}
                            {task.dueDate && (
                              <time className="text-[10px] tabular-nums font-light">
                                {task.dueDate}
                              </time>
                            )}
                          </div>
                        </div>
                      </div>
                    </KanbanItem>
                  ))}
                </div>
              </KanbanColumn>
            );
          })}
        </KanbanBoard>
        <KanbanOverlay>
          <div className="size-full rounded-md bg-primary/10" />
        </KanbanOverlay>
      </Kanban>
    </div>
  );
}
