"use client";

import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { CalendarCheckIcon } from "lucide-react";

export function CreateTask() {
  return (
    <Dialog>
      <DialogTrigger asChild className="my-3">
        <Button variant="secondary" className="bg-sidebar! border font-normal">
          <span>Add Task</span>
          <CalendarCheckIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-normal text-neutral-600">
            Create Task
          </DialogTitle>
          <DialogDescription className="font-light text-muted-foreground">
            Create and assign tasks within this organization
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
