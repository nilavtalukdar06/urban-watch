"use client";

import { api } from "@workspace/backend/convex/_generated/api";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Preloaded, usePreloadedQuery } from "convex/react";
import Link from "next/link";

interface Props {
  preloadedReports: Preloaded<
    typeof api.functions.reports.getProcessedReportsByUser
  >;
}

export function GridView({ preloadedReports }: Props) {
  const result = usePreloadedQuery(preloadedReports);
  if (result === undefined) {
    return (
      <div className="my-4 w-full">
        <p className="text-muted-foreground font-light animate-pulse">
          Fetching Reports...
        </p>
      </div>
    );
  }
  if (result && result.length === 0) {
    return (
      <div className="my-4 w-full">
        <p className="text-red-500 font-light">
          You have not submitted any reports
        </p>
      </div>
    );
  }
  return (
    <div className="my-4 w-full h-full">
      <div className="w-full grid grid-cols-2 max-[500px]:grid-cols-1 place-items-center gap-4">
        {result.map((report) => (
          <Link href={`/reports/${report._id}`} className="w-full h-full">
            <Card className="w-full rounded-none shadow-none bg-sidebar py-3 h-full">
              <CardHeader className="px-4">
                <CardTitle className="text-start text-neutral-700 text-lg font-light">
                  {report.title}
                </CardTitle>
                <CardDescription className="text-start text-muted-foreground font-light">
                  {report.description}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
