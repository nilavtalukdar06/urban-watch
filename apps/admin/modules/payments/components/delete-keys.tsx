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
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { Spinner } from "@workspace/ui/components/spinner";

export function DeleteKeys({ keyId }: { keyId: Id<"apiKeys"> | undefined }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete("/api/secrets/delete", {
        data: {
          keyId,
        },
      });
      toast.success("Deleted API Keys");
      setIsOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete keys");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog open={isOpen || isLoading} onOpenChange={setIsOpen}>
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
          <DialogClose asChild>
            <Button
              disabled={isLoading}
              variant="outline"
              className="shadow-none rounded-none bg-sidebar font-normal"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleDelete}
            disabled={isLoading}
            variant="destructive"
            className="shadow-none rounded-none font-normal"
          >
            {isLoading && <Spinner />}
            {isLoading ? "Loading..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
