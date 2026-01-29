"use client";

import { Id } from "@workspace/backend/convex/_generated/dataModel";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";

interface Props {
  count: number;
  userIds: Id<"citizens">[];
}

export function DeleteUser({ count, userIds }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          disabled={count === 0}
          variant="destructive"
          className="rounded-none! shadow-none font-normal"
        >
          <span>Delete User</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the data
            from our database.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button>Cancel</Button>
          <Button>
            <span>
              Delete {count} {count === 1 ? "user" : "users"}
            </span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
