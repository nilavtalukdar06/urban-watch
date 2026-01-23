"use client";

import { api } from "@workspace/backend/convex/_generated/api";
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
import { useMutation } from "convex/react";
import { TriangleAlertIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function DeleteMessages() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const mutation = useMutation(api.functions.chatbot.deleteMessages);

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await mutation({});
      toast.success("Messages Deleted Successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete messages");
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };
  return (
    <Dialog open={isOpen || isLoading} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon-sm">
          <TriangleAlertIcon className="text-muted-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-normal text-neutral-700">
            Are you absolutely sure?
          </DialogTitle>
          <DialogDescription className="text-muted-foreground font-light">
            This action cannot be undone. This will permanently delete your
            messages.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? <Spinner /> : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
