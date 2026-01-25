"use server";

import { auth } from "@clerk/nextjs/server";

export const verifyAccount = async (imageUrl: string) => {
  const { userId } = await auth();
  return userId;
};
