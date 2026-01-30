"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Id } from "@workspace/backend/convex/_generated/dataModel";
import { LinkIcon } from "lucide-react";
import { Button } from "@workspace/ui/components/button";

interface Props {
  goal: string;
  name: string;
  organizationId: string;
  payments_enabled: boolean;
  purpose: string;
  userId: string;
  _creationTime: number;
  _id: Id<"organization">;
}

export function OrganizationTrigger(props: Props) {
  return (
    <Dialog>
      <DialogTrigger className="w-full">
        <Card className="w-full rounded-none shadow-none bg-sidebar py-3">
          <CardHeader className="px-4">
            <div className="w-full flex justify-between items-center">
              <CardTitle className="text-start text-neutral-700 text-lg font-light">
                {props.name}
              </CardTitle>
              <LinkIcon size={16} className="text-neutral-700" />
            </div>
            <CardDescription className="text-start text-muted-foreground font-light">
              {props.goal}
            </CardDescription>
          </CardHeader>
        </Card>
      </DialogTrigger>
      <DialogContent className="w-[400px] rounded-none p-5">
        <DialogHeader>
          <DialogTitle className="text-neutral-600 font-light text-start">
            {props.name}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground font-light text-start">
            {props.goal}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-start justify-center gap-y-1.5">
          <p className="text-neutral-700 text-sm">Our Purpose</p>
          <p className="text-muted-foreground font-light text-sm">
            {props.purpose}
          </p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="outline"
              className="bg-sidebar rounded-none font-normal shadow-none"
            >
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              variant="destructive"
              className="rounded-none shadow-none font-normal"
            >
              Donate
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
