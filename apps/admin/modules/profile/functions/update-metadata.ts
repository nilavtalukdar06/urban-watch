"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";

export const updateMetadata = async () => {
  const { orgId } = await auth();
  if (!orgId) {
    throw new Error("organization id is not present");
  }
  const client = await clerkClient();
  await client.organizations.updateOrganization(orgId, {
    publicMetadata: {
      hasProfile: true,
    },
  });
};
