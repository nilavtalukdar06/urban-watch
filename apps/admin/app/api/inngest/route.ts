import { serve } from "inngest/next";
import { inngestAdmin } from "@workspace/jobs/inngest/client";
import { sendEmailFunction } from "@workspace/jobs/inngest/functions/send-email";
import { reportResolutionFunction } from "@workspace/jobs/inngest/functions/report-resolution";

export const { GET, POST, PUT } = serve({
  client: inngestAdmin,
  functions: [sendEmailFunction, reportResolutionFunction],
});
