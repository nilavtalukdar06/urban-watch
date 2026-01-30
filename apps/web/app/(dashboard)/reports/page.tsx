import { Navbar } from "@/components/shared/navbar";
import { GridView } from "@/modules/reports/views/grid-view";
import { auth } from "@clerk/nextjs/server";
import { api } from "@workspace/backend/convex/_generated/api";
import { preloadQuery } from "convex/nextjs";
import { redirect } from "next/navigation";

export default async function Reports() {
  const { getToken } = await auth();
  const token = await getToken({ template: "convex" });
  if (!token) {
    redirect("/sign-in");
  }
  const preloadedReports = await preloadQuery(
    api.functions.reports.getProcessedReportsByUser,
    {},
    { token },
  );
  return (
    <div className="w-full">
      <Navbar />
      <div className="p-4">
        <p className="text-lg text-neutral-600">My Reports</p>
        <p className="font-light text-muted-foreground text-sm">
          Manage all of your submitted reports from here
        </p>
        <GridView preloadedReports={preloadedReports} />
      </div>
    </div>
  );
}
