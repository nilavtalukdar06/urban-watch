import { GridView } from "@/modules/reports/views/my-reports-grid-view";
import { auth } from "@clerk/nextjs/server";
import { api } from "@workspace/backend/convex/_generated/api";
import { preloadQuery } from "convex/nextjs";
import { redirect } from "next/navigation";

export default async function MyReportsPage() {
  const { getToken } = await auth();
  const token = await getToken({ template: "convex" });
  if (!token) {
    redirect("/sign-in");
  }
  const preloadedReports = await preloadQuery(
    api.functions.reports.getReportsByOrganization,
    {},
    { token },
  );
  return (
    <div className="px-4 pb-4">
      <p className="text-lg text-neutral-600 font-light">My Reports</p>
      <p className="text-sm text-muted-foreground font-light">
        Reports assigned to your organization
      </p>
      <GridView preloadedReports={preloadedReports} />
    </div>
  );
}
