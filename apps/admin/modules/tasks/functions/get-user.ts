"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";

export const getUser = async (assignedToUserId: string) => {
  const { userId, orgId } = await auth();
  if (!userId) {
    throw new Error("the user is not authenticated");
  }
  if (!orgId) {
    throw new Error("organization doesn't exist");
  }
  const client = await clerkClient();
  const membership = await client.organizations.getOrganizationMembershipList({
    organizationId: orgId,
    userId: [assignedToUserId],
  });
  const user = await client.users.getUser(assignedToUserId);
  return JSON.parse(
    JSON.stringify({
      fullName: user.fullName,
      email: user.primaryEmailAddress?.emailAddress as string | null,
      role: membership.data[0]?.role,
    }),
  );
};
