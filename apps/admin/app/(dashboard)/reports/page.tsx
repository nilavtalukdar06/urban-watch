import { GridView } from "@/modules/reports/views/grid-view";
import { auth } from "@clerk/nextjs/server";
import { api } from "@workspace/backend/convex/_generated/api";
import { preloadQuery } from "convex/nextjs";
import { redirect } from "next/navigation";

export default async function ReportsPage() {
  const { getToken } = await auth();
  const token = await getToken({ template: "convex" });
  if (!token) {
    redirect("/sign-in");
  }
  const preloadedReports = await preloadQuery(
    api.functions.reports.getAllReports,
    {},
    { token },
  );
  return (
    <div className="px-4 pb-4">
      <p className="text-lg text-neutral-600 font-light">All Users</p>
      <p className="text-sm text-muted-foreground font-light">
        Manage all of the user accounts here
      </p>
      <GridView preloadedReports={preloadedReports} />
    </div>
  );
}
