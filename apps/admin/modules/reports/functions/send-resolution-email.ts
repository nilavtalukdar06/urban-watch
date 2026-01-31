"use server";

import { inngestAdmin } from "@workspace/jobs/inngest/client";
import { fetchQuery } from "convex/nextjs";
import { api } from "@workspace/backend/convex/_generated/api";
import { auth } from "@clerk/nextjs/server";

export async function sendReportResolutionEmail(reportId: string) {
  try {
    const { getToken } = await auth();
    const token = await getToken({ template: "convex" });
    if (!token) {
      throw new Error("Unauthorized");
    }
    if (!reportId) {
      throw new Error("Report ID is required");
    }
    const report = await fetchQuery(
      api.functions.reports.getReportById,
      {
        reportId: reportId as any,
      },
      { token },
    );
    if (!report) {
      throw new Error("Report not found");
    }
    await inngestAdmin.send({
      name: "report/resolved",
      data: {
        reportId,
        userId: report.userId,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error triggering resolution email:", error);
    throw error;
  }
}
