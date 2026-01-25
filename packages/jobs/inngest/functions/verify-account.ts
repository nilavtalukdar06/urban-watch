import { inngest } from "../client";
import { verifyAccount } from "../vercel/agents/verify-account";
import { verificationEmail } from "@workspace/emails/src/verify-account";

export const verifyAccountFunction = inngest.createFunction(
  { id: "verify-account" },
  { event: "test/verify-account" },
  async ({ event, step }) => {
    const account = await step.run("verify-account", async () => {
      return await verifyAccount({
        imageUrl: event.data.imageUrl,
        user: {
          name: event.data.user.name,
          dateOfBirth: event.data.user.dateOfBirth,
          permanentAddress: event.data.user.permanentAddress,
        },
      });
    });
    const result = await step.run("send-email", async () => {
      return await verificationEmail(
        event.data.user.email,
        account.email.subject,
        account.email.body,
      );
    });
    return result;
  },
);
