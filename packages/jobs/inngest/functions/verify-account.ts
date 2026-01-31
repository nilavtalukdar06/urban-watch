import { fetchMutation } from "convex/nextjs";
import { inngestWeb } from "../client";
import { verifyAccount } from "../vercel/agents/verify-account";
import { verificationEmail } from "@workspace/emails/src/verify-account";
import { api } from "@workspace/backend/convex/_generated/api";

export const verifyAccountFunction = inngestWeb.createFunction(
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
    await step.run("insert-record", async () => {
      await fetchMutation(api.functions.verification.verificationRecord, {
        citizenId: event.data.user.citizenId,
        isAuthorized: account.isAuthorized,
        documentType: account.documentType ?? undefined,
        notes: account.notes,
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
