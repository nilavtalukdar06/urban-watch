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
  const user = await client.users.getUser(assignedToUserId);
  return JSON.parse(
    JSON.stringify({
      fullName: user.fullName,
      email: user.primaryEmailAddress?.emailAddress as string | null,
    }),
  );
};
