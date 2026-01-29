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
import { Button } from "@workspace/ui/components/button";
import type { Id } from "@workspace/backend/convex/_generated/dataModel";

export function DeleteKeys({ keyId }: { keyId: Id<"apiKeys"> | undefined }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="destructive"
          className="rounded-none shadow-none font-normal"
        >
          Delete Keys
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[425px] rounded-none p-5">
        <DialogHeader>
          <DialogTitle className="font-light text-neutral-700">
            Delete Keys
          </DialogTitle>
          <DialogDescription className="font-light text-sm text-muted-foreground">
            Are you sure that you want to delete your current stripe keys? if
            you want to add new stripe keys to your account then you must have
            to delete the old ones.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose>
            <Button
              variant="outline"
              className="shadow-none rounded-none bg-sidebar font-normal"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            className="shadow-none rounded-none font-normal"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
