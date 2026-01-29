"use client";

import { Button } from "@workspace/ui/components/button";
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

export function EnablePayments() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="rounded-none shadow-none font-normal">
          Enable Payments
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[425px] rounded-none p-5">
        <DialogHeader>
          <DialogTitle className="text-neutral-700 font-light">
            Enable Payments
          </DialogTitle>
          <DialogDescription className="font-light text-sm text-muted-foreground">
            Go to your stripe dashboard and grab your public and private api
            keys
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="outline"
              className="rounded-none shadow-none bg-sidebar border font-normal"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            className="rounded-none shadow-none font-normal"
          >
            Save Keys
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
