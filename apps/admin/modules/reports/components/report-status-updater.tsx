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

      // If status is resolved, trigger the email event
      if (newStatus === "resolved") {
        await fetch("/api/reports/send-resolution-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reportId,
          }),
        });
      }

      toast.success(
        `Report marked as ${newStatus === "resolved" ? "resolved" : "pending"}`,
      );
      setOpen(false);
      // Refresh the page to see updated status
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
        <Button variant="outline" size="sm" className="rounded-none font-light">
          Update Status
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-none">
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
