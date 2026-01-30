"use client";

import { api } from "@workspace/backend/convex/_generated/api";
import { Preloaded, usePreloadedQuery, useMutation } from "convex/react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@workspace/ui/components/input-group";
import { SearchIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { formatDistanceToNow, format } from "date-fns";
import { Button } from "@workspace/ui/components/button";
import { toast } from "sonner";

export function GridView({
  preloadedReports,
}: {
  preloadedReports: Preloaded<typeof api.functions.reports.getAllReports>;
}) {
  const reports = usePreloadedQuery(preloadedReports);
  const takeReportMutation = useMutation(api.functions.reports.takeReport);
  const [searchQuery, setSearchQuery] = useState("");
  const [takingReport, setTakingReport] = useState<string | null>(null);

  const handleTakeReport = async (reportId: string) => {
    try {
      setTakingReport(reportId);
      await takeReportMutation({
        reportId: reportId as any,
      });
      toast.success("Report taken successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to take report",
      );
    } finally {
      setTakingReport(null);
    }
  };
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
  const filteredReports = reports.filter((report) =>
    report.title?.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  return (
    <div className="w-full my-3 space-y-4">
      <InputGroup className="max-w-sm w-full shadow-none rounded-none">
        <InputGroupInput
          placeholder="Search reports by title"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="placeholder:text-muted-foreground text-muted-foreground font-light placeholder:font-light rounded-none"
        />
        <InputGroupAddon>
          <SearchIcon className="text-muted-foreground" />
        </InputGroupAddon>
      </InputGroup>
      <div className="w-full h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 place-items-center">
        {filteredReports.map((report) => {
          const createdAt = report?._creationTime
            ? new Date(report._creationTime)
            : null;

          return (
            <Card
              className="w-full rounded-none shadow-none bg-sidebar py-3 h-full flex flex-col justify-between items-start hover:bg-sidebar/80 transition-colors cursor-pointer"
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
              {createdAt && (
                <div className="px-4 w-full space-y-1">
                  <p className="text-xs text-muted-foreground font-light">
                    Submitted{" "}
                    {formatDistanceToNow(createdAt, { addSuffix: true })}
                  </p>
                  <p className="text-xs text-muted-foreground font-light">
                    {format(createdAt, "PPp")}
                  </p>
                </div>
              )}
              <CardFooter className="px-4 flex justify-start items-center gap-x-2">
                <Button
                  className="w-fit shadow-none rounded-none font-normal"
                  variant="destructive"
                  size="sm"
                  onClick={() => handleTakeReport(report._id)}
                  disabled={takingReport === report._id}
                >
                  {takingReport === report._id ? "Taking..." : "Take Report"}
                </Button>
                <Button
                  className="w-fit shadow-none rounded-none font-normal"
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <Link href={`/reports/${report._id}`}>See Report</Link>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
      {filteredReports.length === 0 && (
        <p className="text-muted-foreground font-light">
          No reports found matching your search.
        </p>
      )}
    </div>
  );
}
