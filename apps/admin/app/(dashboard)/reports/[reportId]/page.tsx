import { auth } from "@clerk/nextjs/server";
import { api } from "@workspace/backend/convex/_generated/api";
import type { Id } from "@workspace/backend/convex/_generated/dataModel";
import { fetchQuery } from "convex/nextjs";
import Image from "next/image";
import { redirect } from "next/navigation";
import { formatDistanceToNow, format } from "date-fns";

export default async function ReportPage({
  params,
}: {
  params: Promise<{ reportId: Id<"reports"> }>;
}) {
  const { getToken } = await auth();
  const token = await getToken({ template: "convex" });
  if (!token) {
    redirect("/sign-in");
  }
  const { reportId } = await params;
  const result = await fetchQuery(
    api.functions.reports.getReportDetails,
    { reportId },
    { token },
  );

  const createdAt = result?._creationTime
    ? new Date(result._creationTime)
    : null;

  return (
    <div className="w-full">
      <div className="w-full p-4 space-y-4">
        <Image
          src={result?.imageUrl!}
          alt="report image"
          className="rounded-sm"
          height={200}
          width={300}
        />
        <p className="text-sm text-muted-foreground font-light">
          #{" "}
          {result?.status?.charAt(0).toUpperCase()! + result?.status?.slice(1)!}
        </p>
        <h2 className="text-lg font-light text-neutral-700">{result?.title}</h2>

        {createdAt && (
          <div className="space-y-1">
            <p className="text-neutral-600 font-normal text-sm">
              Report Submitted At
            </p>
            <p className="text-muted-foreground font-light text-sm">
              {format(createdAt, "PPpp")} (
              {formatDistanceToNow(createdAt, { addSuffix: true })})
            </p>
          </div>
        )}

        <div className="space-y-1">
          <p className="text-neutral-600 font-normal text-sm">
            Report Description
          </p>
          <p className="text-muted-foreground font-light text-sm">
            {result?.description}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-neutral-600 font-normal text-sm">Location</p>
          <p className="text-muted-foreground font-light text-sm">
            {result?.location}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-neutral-600 font-normal text-sm">Instructions</p>
          {result?.instructions?.map((instruction, index) => (
            <p className="font-light text-muted-foreground text-sm" key={index}>
              {index + 1}. {instruction}
            </p>
          ))}
        </div>
        <div className="space-y-1">
          <p className="text-neutral-600 font-normal text-sm">
            What not to do?
          </p>
          {result?.whatNotToDo?.map((instruction, index) => (
            <p className="font-light text-muted-foreground text-sm" key={index}>
              {index + 1}. {instruction}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
