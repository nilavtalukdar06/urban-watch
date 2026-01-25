import { serve } from "inngest/next";
import { inngest } from "@workspace/jobs/inngest/client";
import { healthCheck } from "@workspace/jobs/inngest/functions/health";
import { verifyAccountFunction } from "@workspace/jobs/inngest/functions/verify-account";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [healthCheck, verifyAccountFunction],
});
