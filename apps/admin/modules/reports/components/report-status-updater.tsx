"use client";

import { api } from "@workspace/backend/convex/_generated/api";
import type { Id } from "@workspace/backend/convex/_generated/dataModel";
import { useMutation } from "convex/react";
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
import { useState } from "react";
import { toast } from "sonner";
import { sendReportResolutionEmail } from "../functions/send-resolution-email";

interface ReportStatusUpdaterProps {
  reportId: Id<"reports">;
  status?: "pending" | "resolved";
}

export function ReportStatusUpdater({
  reportId,
  status,
}: ReportStatusUpdaterProps) {
  const [open, setOpen] = useState(false);
  const updateStatusMutation = useMutation(
    api.functions.reports.updateReportStatus,
  );
  const [isUpdating, setIsUpdating] = useState(false);

  const newStatus = status === "pending" ? "resolved" : "pending";

  const handleUpdateStatus = async () => {
    try {
      setIsUpdating(true);
      await updateStatusMutation({
        reportId,
        status: newStatus,
      });
      if (newStatus === "resolved") {
        await sendReportResolutionEmail(reportId);
      }
      toast.success(
        `Report marked as ${newStatus === "resolved" ? "resolved" : "pending"}`,
      );
      setOpen(false);
      window.location.reload();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update status",
      );
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="rounded-none font-light shadow-none bg-sidebar"
        >
          Update Status
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-none w-[425px] p-5">
        <DialogHeader>
          <DialogTitle className="font-light">Update Report Status</DialogTitle>
          <DialogDescription className="font-light">
            Change the status of this report to{" "}
            <span className="font-semibold">
              {newStatus === "resolved" ? "Resolved" : "Pending"}
            </span>
            .
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="rounded-none font-light"
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleUpdateStatus}
            disabled={isUpdating}
            className="rounded-none font-light"
          >
            {isUpdating ? "Updating..." : "Update Status"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
