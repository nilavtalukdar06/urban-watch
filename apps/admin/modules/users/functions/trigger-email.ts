"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { inngest } from "@workspace/jobs/inngest/client";

export const triggerEmail = async (
  email: string,
  subject: string,
  body: string,
) => {
  try {
    const { isAuthenticated, orgId } = await auth();
    if (!isAuthenticated) {
      throw new Error("the user is not authenticated");
    }
    if (!orgId) {
      throw new Error("organization doesn't exist");
    }
    const client = await clerkClient();
    const organization = await client.organizations.getOrganization({
      organizationId: orgId,
    });
    await inngest.send({
      name: "user/send-email",
      data: {
        orgName: organization.name,
        email,
        subject,
        body,
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};
