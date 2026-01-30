import { fetchQuery } from "convex/nextjs";
import { inngest } from "../client";
import { generateResolutionEmail } from "../vercel/agents/generate-resolution-email";
import { reportAnalysisEmail } from "@workspace/emails/src/report-analysis";
import { api } from "@workspace/backend/convex/_generated/api";

export const reportResolutionFunction = inngest.createFunction(
  { id: "report-resolution" },
  { event: "report/resolved" },
  async ({ event, step }) => {
    const report = await step.run("fetch-report", async () => {
      return await fetchQuery(api.functions.reports.getReportById, {
        reportId: event.data.reportId,
      });
    });
    if (!report) {
      throw new Error("Report not found");
    }
    const user = await step.run("fetch-user", async () => {
      return await fetchQuery(api.functions.users.getUserById, {
        userId: event.data.userId,
      });
    });
    if (!user) {
      throw new Error("User not found");
    }
    const emailContent = await step.run("generate-email", async () => {
      return await generateResolutionEmail({
        title: report.title || "Your Report",
        description: report.description || "",
        location: report.location,
      });
    });
    const emailResult = await step.run("send-email", async () => {
      return await reportAnalysisEmail(
        user.email,
        emailContent.subject,
        emailContent.body,
      );
    });
    return emailResult;
  },
);
