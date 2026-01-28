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
import { Loader, RadioTowerIcon, TriangleAlertIcon, XIcon } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/convex/_generated/api";
import type { Id } from "@workspace/backend/convex/_generated/dataModel";
import { toast } from "sonner";
import { useOrganization } from "@clerk/nextjs";

type Task = {
  title: string;
  description: string;
  assignedToUserId: string;
  assignedByUserId: string;
  assigneeName: string;
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

const status = {
  pending: "Pending",
  in_progress: "In Progress",
  cancelled: "Cancelled",
  completed: "Completed",
};

export function EventCard(props: EventCardProps) {
  const { membership } = useOrganization();
  const mutation = useMutation(api.functions.tasks.deleteTask);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleClick = async () => {
    try {
      setIsLoading(true);
      await mutation({ taskId: props.resource._id as Id<"tasks"> });
      toast.success("Task Deleted Successfully");
      setIsOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog open={isOpen || isLoading} onOpenChange={setIsOpen}>
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
          <span className="text-muted-foreground font-light">
            {props.resource.assigneeName}
          </span>
        </div>
        <p className="text-sm text-muted-foreground font-light">
          #{" "}
          {
            status[
              props.resource.status as
                | "pending"
                | "in_progress"
                | "cancelled"
                | "completed"
            ]
          }
        </p>
        <DialogFooter>
          <Button
            size="sm"
            disabled={isLoading}
            variant="secondary"
            onClick={() => setIsOpen(false)}
          >
            Cancel
            <XIcon />
          </Button>
          {membership?.role === "org:admin" && (
            <Button size="sm" variant="destructive" onClick={handleClick}>
              {isLoading ? "Loading..." : "Delete Task"}
              {isLoading ? (
                <Loader className="animate-spin" />
              ) : (
                <TriangleAlertIcon />
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
