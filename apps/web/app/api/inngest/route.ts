import { serve } from "inngest/next";
import { inngest } from "@workspace/jobs/inngest/client";
import { healthCheck } from "@workspace/jobs/inngest/functions/health";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [healthCheck],
});
