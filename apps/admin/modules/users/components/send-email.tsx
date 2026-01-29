"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
}

export function SendEmail({ open, onOpenChange, email }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-none w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-light text-xl text-neutral-600">
            Send Email
          </DialogTitle>
          <DialogDescription className="font-light text-sm text-muted-foreground">
            Shoot an email directly to the user&apos;s inbox
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
