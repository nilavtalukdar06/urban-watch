"use client";

import { Dialog, DialogTrigger } from "@workspace/ui/components/dialog";
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
    </Dialog>
  );
}
