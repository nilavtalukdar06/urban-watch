import { Navbar } from "@/components/shared/navbar";
import { auth } from "@clerk/nextjs/server";
import { api } from "@workspace/backend/convex/_generated/api";
import type { Id } from "@workspace/backend/convex/_generated/dataModel";
import { fetchQuery } from "convex/nextjs";
import Image from "next/image";
import { redirect } from "next/navigation";

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
  return (
    <div className="w-full">
      <Navbar />
      <div className="w-full p-4">
        <Image
          src={result?.imageUrl!}
          alt="report image"
          height={200}
          width={300}
        />
      </div>
    </div>
  );
}
