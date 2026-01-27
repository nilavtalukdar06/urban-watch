"use client";

import { cn } from "@workspace/ui/lib/utils";
import { RadioTowerIcon } from "lucide-react";

type Task = {
  title: string;
  description: string;
  assignedToUserId: string;
  assignedByUserId: string;
  status: string;
  organizationId: string;
  dueDate: number;
  _id: string;
  _creationTime: number;
};

type EventCardProps = {
  end: Date;
  title: string;
  start: Date;
  resource: Task;
};

const taskColors = {
  pending: "bg-yellow-50 text-yellow-600 border-yellow-200",
  in_progress: "bg-blue-50 text-blue-600 border-blue-200",
  cancelled: "bg-red-50 text-red-600 border-red-200",
  completed: "bg-green-50 text-green-600 border-green-200",
};

export function EventCard(props: EventCardProps) {
  return (
    <button
      className={cn(
        "w-full flex-1 my-[1px] flex justify-start items-center text-xs font-medium border p-1 rounded-sm gap-x-1 cursor-pointer",
        taskColors[
          props.resource.status as
            | "pending"
            | "in_progress"
            | "cancelled"
            | "completed"
        ],
      )}
    >
      <RadioTowerIcon size={14} className="text-inherit" />
      <span className="flex-1 truncate text-start">{props.title}</span>
    </button>
  );
}
