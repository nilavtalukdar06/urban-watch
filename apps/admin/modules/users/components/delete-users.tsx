"use client";

import { api } from "@workspace/backend/convex/_generated/api";
import type { Id } from "@workspace/backend/convex/_generated/dataModel";
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
import { Spinner } from "@workspace/ui/components/spinner";
import { useAction } from "convex/react";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  count: number;
  userIds: Id<"citizens">[];
  clerkIds: string[];
  onDeleted: () => void;
}

export function DeleteUser({ count, userIds, clerkIds, onDeleted }: Props) {
  const action = useAction(api.functions.users.deleteUsers);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await action({
        clerkIds,
        userIds,
      });
      toast.success("Users Deleted Successfully");
      onDeleted();
      setIsOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete users");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog open={isOpen || isLoading} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          disabled={count === 0}
          variant="destructive"
          className="rounded-none! shadow-none font-normal"
        >
          Delete{" "}
          {count === 0
            ? "Users"
            : count === 1
              ? `${count} user`
              : `${count} users`}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[425px] p-5 rounded-none">
        <DialogHeader>
          <DialogTitle className="font-light text-xl text-neutral-600">
            Are you absolutely sure?
          </DialogTitle>
          <DialogDescription className="text-sm font-light text-muted-foreground">
            This action cannot be undone. This will permanently delete the data
            from our database.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            className="rounded-none bg-sidebar! shadow-none border font-normal"
            variant="outline"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          <Button
            className="rounded-none shadow-none font-normal"
            variant="destructive"
            disabled={isLoading}
            onClick={handleDelete}
          >
            {isLoading && <Spinner />}
            <span>{isLoading ? "Loading" : "Delete"}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
