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
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface DeleteReportProps {
  reportId: Id<"reports">;
}

export function DeleteReport({ reportId }: DeleteReportProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const router = useRouter();
  const mutation = useMutation(api.functions.reports.deleteReport);

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await mutation({ reportId });
      toast.success("Report Deleted Successfully");
      router.push("/reports");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete report");
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen || isLoading} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          className="rounded-none! shadow-none font-normal"
        >
          Delete Report
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[425px] p-5 rounded-none">
        <DialogHeader>
          <DialogTitle className="font-light text-xl text-neutral-600">
            Are you absolutely sure?
          </DialogTitle>
          <DialogDescription className="text-sm font-light text-muted-foreground">
            This action cannot be undone. This will permanently delete your
            report.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            className="rounded-none bg-sidebar! shadow-none border font-normal"
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
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
