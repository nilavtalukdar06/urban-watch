import { serve } from "inngest/next";
import { inngest } from "@workspace/jobs/inngest/client";
import { sendEmailFunction } from "@workspace/jobs/inngest/functions/send-email";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [sendEmailFunction],
});
