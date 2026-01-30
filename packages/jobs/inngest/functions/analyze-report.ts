import { fetchMutation, fetchQuery } from "convex/nextjs";
import { inngest } from "../client";
import { analyzeReport } from "../vercel/agents/analyze-report";
import { reportAnalysisEmail } from "@workspace/emails/src/report-analysis";
import { api } from "@workspace/backend/convex/_generated/api";

export const analyzeReportFunction = inngest.createFunction(
  { id: "analyze-report" },
  { event: "report/analyze" },
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
    const analysis = await step.run("analyze-report", async () => {
      return await analyzeReport({
        imageUrl: report.imageUrl,
        location: report.location,
        notes: report.notes,
      });
    });
    await step.run("update-report", async () => {
      await fetchMutation(api.functions.reports.updateReportWithAnalysis, {
        reportId: event.data.reportId,
        isSpam: analysis.isSpam,
        title: analysis.title ?? undefined,
        description: analysis.description ?? undefined,
        instructions: analysis.instructions ?? undefined,
        whatNotToDo: analysis.whatNotToDo ?? undefined,
        priority: analysis.priority ?? undefined,
        inferredGoal: analysis.inferredGoal ?? undefined,
        inferredPurpose: analysis.inferredPurpose ?? undefined,
      });
    });
    const emailResult = await step.run("send-email", async () => {
      return await reportAnalysisEmail(
        user.email,
        analysis.email.subject,
        analysis.email.body,
      );
    });
    return emailResult;
  },
);
