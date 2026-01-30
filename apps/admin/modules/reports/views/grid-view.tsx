"use client";

import { api } from "@workspace/backend/convex/_generated/api";
import { Preloaded, usePreloadedQuery } from "convex/react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";

export function GridView({
  preloadedReports,
}: {
  preloadedReports: Preloaded<typeof api.functions.reports.getAllReports>;
}) {
  const reports = usePreloadedQuery(preloadedReports);
  console.log(reports);
  if (reports === undefined) {
    return (
      <div className="w-full my-3">
        <p className="text-muted-foreground font-light animate-pulse">
          Fetching Reports
        </p>
      </div>
    );
  }
  if (reports.length === 0) {
    return (
      <div className="w-full my-3">
        <p className="text-red-500 font-light animate-pulse">
          There are no reports as of now
        </p>
      </div>
    );
  }
  return (
    <div className="w-full my-3">
      <div className="w-full h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 place-items-center">
        {reports.map((report) => (
          <Card
            className="w-full rounded-none shadow-none bg-sidebar py-3 h-full flex flex-col justify-between items-start"
            key={report._id}
          >
            <CardHeader className="px-4 w-full">
              <CardTitle className="text-start text-neutral-700 text-lg font-light">
                {report.title}
              </CardTitle>
              <CardDescription className="text-start text-muted-foreground font-light">
                {report.description}
              </CardDescription>
            </CardHeader>
            <CardFooter className="px-4">
              <Button
                className="w-fit shadow-none rounded-none font-normal"
                variant="destructive"
              >
                Take Report
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
