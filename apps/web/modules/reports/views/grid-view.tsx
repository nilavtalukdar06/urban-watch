"use client";

import { api } from "@workspace/backend/convex/_generated/api";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@workspace/ui/components/input-group";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { SearchIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface Props {
  preloadedReports: Preloaded<
    typeof api.functions.reports.getProcessedReportsByUser
  >;
}

export function GridView({ preloadedReports }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
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

  const filteredReports = result.filter((report) =>
    report.title?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="my-4 w-full h-full space-y-4">
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
      <div className="w-full grid grid-cols-2 max-[500px]:grid-cols-1 place-items-center gap-4">
        {filteredReports.map((report) => (
          <Link
            href={`/reports/${report._id}`}
            className="w-full h-full"
            key={report._id}
          >
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
      {filteredReports.length === 0 && (
        <p className="text-muted-foreground font-light">
          No reports found matching your search.
        </p>
      )}
    </div>
  );
}
