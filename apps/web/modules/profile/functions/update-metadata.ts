"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";

export const updateMetadata = async () => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("the user is not authenticated");
  } else {
    const client = clerkClient();
    (await client).users.updateUserMetadata(userId, {
      publicMetadata: {
        hasOnboarded: true,
      },
    });
    return {
      success: true,
      message: "updated metadata",
    };
  }
};
