"use server";

import { upsertUser } from "@/lib/stream";
import { api } from "@workspace/backend/convex/_generated/api";
import { fetchMutation } from "convex/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";

interface User {
  fullName: string;
  phoneNumber: string;
  dateOfBirth: string;
  permanentAddress: string;
}

export const createUser = async (user: User) => {
  try {
    const token =
      (await (await auth()).getToken({ template: "convex" })) ?? undefined;
    const clerkUser = await currentUser();
    if (!clerkUser) {
      throw new Error("user is not authenticated");
    }
    const result = await fetchMutation(
      api.functions.users.createUser,
      {
        ...user,
        clerkUserId: clerkUser.id,
      },
      { token },
    );
    await upsertUser(clerkUser.id, clerkUser.fullName!, clerkUser.imageUrl);
    return {
      success: true,
      convexUserId: result,
      message: "user created successfully",
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};
