"use client";

import { api } from "@workspace/backend/convex/_generated/api";
import { Preloaded, usePreloadedQuery } from "convex/react";

export function GridView({
  preloadedReports,
}: {
  preloadedReports: Preloaded<typeof api.functions.reports.getAllReports>;
}) {
  const reports = usePreloadedQuery(preloadedReports);
  console.log(reports);
  return (
    <div className="w-full my-3">
      <p className="text-muted-foreground font-light">Grid View Reports</p>
    </div>
  );
}
