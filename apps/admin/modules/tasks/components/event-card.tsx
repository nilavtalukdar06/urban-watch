"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { cn } from "@workspace/ui/lib/utils";
import {
  CornerRightDown,
  RadioTowerIcon,
  TriangleAlertIcon,
  XIcon,
} from "lucide-react";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { getUser } from "../functions/get-user";
import { Button } from "@workspace/ui/components/button";
import { Skeleton } from "@workspace/ui/components/skeleton";

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

type Assignee = {
  email: string | null;
  fullName: string | null;
};

export function EventCard(props: EventCardProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [assignee, setAssignee] = useState<Assignee | null>(null);
  useEffect(() => {
    const fetchUser = async () => {
      const result = await getUser(props.resource.assignedToUserId);
      setAssignee({ ...result });
    };
    fetchUser();
  }, []);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="w-full" asChild>
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
      </DialogTrigger>
      <DialogContent className="w-[425px] p-4">
        <DialogHeader>
          <DialogTitle className="font-normal text-neutral-700">
            {props.title}
          </DialogTitle>
          <DialogDescription className="font-light text-muted-foreground">
            {props.resource.description}
          </DialogDescription>
        </DialogHeader>
        <p className="text-neutral-700 text-sm">
          Due Date:{" "}
          <span className="font-light text-muted-foreground">
            {format(props.end, "dd MMMM yyyy")}
          </span>
        </p>
        <div className="text-neutral-700 flex justify-start items-center gap-x-2 text-sm">
          Assigned To:{" "}
          {assignee === undefined ? (
            <Skeleton className="h-3 w-[120px]" />
          ) : (
            <span className="text-muted-foreground font-light">
              {assignee?.fullName}
            </span>
          )}
        </div>
        <DialogFooter>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setIsOpen(false)}
          >
            Cancel
            <XIcon />
          </Button>
          <Button size="sm" variant="destructive">
            Delete Task
            <TriangleAlertIcon />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
