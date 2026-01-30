"use client";

import { api } from "@workspace/backend/convex/_generated/api";
import { Preloaded, usePreloadedQuery } from "convex/react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { SearchIcon } from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";
import { formatDistanceToNow, format } from "date-fns";

interface ReportWithAssignmentStatus {
  _id?: string;
  _creationTime?: number;
  title?: string;
  description?: string;
  priority?: "low" | "medium" | "high";
  status?: "pending" | "resolved";
  assignmentStatus: string;
  [key: string]: any;
}

export function GridView({
  preloadedReports,
}: {
  preloadedReports: Preloaded<
    typeof api.functions.reports.getReportsByOrganization
  >;
}) {
  const reports = usePreloadedQuery(preloadedReports);
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredReports = useMemo(() => {
    if (!reports) return [];

    return reports.filter((report) => {
      const matchesSearch = report.title
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesPriority =
        priorityFilter === "all" || report.priority === priorityFilter;
      const matchesStatus =
        statusFilter === "all" || report.status === statusFilter;

      return matchesSearch && matchesPriority && matchesStatus;
    });
  }, [reports, searchQuery, priorityFilter, statusFilter]);

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
        <p className="text-red-500 font-light">
          You have not assigned any reports yet
        </p>
      </div>
    );
  }

  return (
    <div className="w-full my-3 space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
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

        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-full sm:w-40 rounded-none">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40 rounded-none">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="w-full h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 place-items-center">
        {filteredReports.map((report: ReportWithAssignmentStatus) => {
          const createdAt = report?._creationTime
            ? new Date(report._creationTime)
            : null;

          return (
            <Link
              href={`/my-reports/${report._id}`}
              key={report._id}
              className="w-full h-full"
            >
              <Card className="w-full rounded-none shadow-none bg-sidebar py-3 h-full hover:bg-sidebar/80 transition-colors cursor-pointer">
                <CardHeader className="px-4 w-full">
                  <CardTitle className="text-start text-neutral-700 text-lg font-light">
                    {report.title}
                  </CardTitle>
                  <CardDescription className="text-start text-muted-foreground font-light">
                    {report.description}
                  </CardDescription>

                  {(report.priority || report.status) && (
                    <div className="mt-3 flex gap-2 flex-wrap">
                      {report.priority && (
                        <span
                          className={`text-xs px-2 py-1 rounded font-medium ${
                            report.priority === "high"
                              ? "bg-red-100 text-red-800"
                              : report.priority === "medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                          }`}
                        >
                          {report.priority.charAt(0).toUpperCase() +
                            report.priority.slice(1)}
                        </span>
                      )}
                      {report.status && (
                        <span
                          className={`text-xs px-2 py-1 rounded font-medium ${
                            report.status === "resolved"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-orange-100 text-orange-800"
                          }`}
                        >
                          {report.status.charAt(0).toUpperCase() +
                            report.status.slice(1)}
                        </span>
                      )}
                    </div>
                  )}
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
              </Card>
            </Link>
          );
        })}
      </div>
      {filteredReports.length === 0 && (
        <p className="text-muted-foreground font-light">
          No reports found matching your filters.
        </p>
      )}
    </div>
  );
}
