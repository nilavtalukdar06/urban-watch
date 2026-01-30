import { serve } from "inngest/next";
import { inngest } from "@workspace/jobs/inngest/client";
import { healthCheck } from "@workspace/jobs/inngest/functions/health";
import { verifyAccountFunction } from "@workspace/jobs/inngest/functions/verify-account";
import { analyzeReportFunction } from "@workspace/jobs/inngest/functions/analyze-report";
import { reportResolutionFunction } from "@workspace/jobs/inngest/functions/report-resolution";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    healthCheck,
    verifyAccountFunction,
    analyzeReportFunction,
    reportResolutionFunction,
  ],
});
