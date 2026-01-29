import { inngest } from "../client";
import { sendEmail } from "@workspace/emails/src/send-email";

export const sendEmailFunction = inngest.createFunction(
  { id: "send-email-to-user" },
  { event: "user/send-email" },
  async ({ event, step }) => {
    const result = await step.run("send-user-email", async () => {
      return await sendEmail(
        event.data.email,
        event.data.subject,
        event.data.body,
      );
    });
    return result;
  },
);
