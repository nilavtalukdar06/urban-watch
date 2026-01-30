import { inngest } from "@workspace/jobs/inngest/client";
import { fetchQuery } from "convex/nextjs";
import { api } from "@workspace/backend/convex/_generated/api";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  try {
    const { getToken } = await auth();
    const token = await getToken({ template: "convex" });
    if (!token) {
      return new Response("Unauthorized", { status: 401 });
    }
    const { reportId } = await request.json();

    if (!reportId) {
      return new Response("Report ID is required", { status: 400 });
    }
    const report = await fetchQuery(
      api.functions.reports.getReportById,
      {
        reportId,
      },
      { token },
    );
    if (!report) {
      return new Response("Report not found", { status: 404 });
    }
    await inngest.send({
      name: "report/resolved",
      data: {
        reportId,
        userId: report.userId,
      },
    });
    return new Response("Event triggered successfully", { status: 200 });
  } catch (error) {
    console.error("Error triggering resolution email:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
