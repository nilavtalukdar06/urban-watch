"use client";

import { Button } from "@workspace/ui/components/button";
import { Dialog, DialogTrigger } from "@workspace/ui/components/dialog";

export function EnablePayments() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="rounded-none shadow-none font-normal">
          Enable Payments
        </Button>
      </DialogTrigger>
    </Dialog>
  );
}
