"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";

export async function getOrganizationMemebers() {
  const { userId, orgId } = await auth();
  if (!userId) {
    throw new Error("the user is not authenticated");
  }
  if (!orgId) {
    throw new Error("organization doesn't exist");
  }
  const members = await (
    await clerkClient()
  ).organizations.getOrganizationMembershipList({
    organizationId: orgId,
  });
  const result = members.data.map((member) => ({
    userId: member.publicUserData?.userId,
    email: member.publicUserData?.identifier,
    name:
      member.publicUserData?.firstName + " " + member.publicUserData?.lastName,
    role: member.role,
  }));
  return result;
}
