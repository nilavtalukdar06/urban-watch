"use client";

import { api } from "@workspace/backend/convex/_generated/api";
import { Preloaded } from "convex/react";

interface Props {
  preloadedReports: Preloaded<
    typeof api.functions.reports.getProcessedReportsByUser
  >;
}

export function GridView({ preloadedReports }: Props) {
  return (
    <div className="my-4">
      <p className="text-muted-foreground font-light">Grid View</p>
    </div>
  );
}
