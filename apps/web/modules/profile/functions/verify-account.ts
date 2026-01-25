"use server";

import { auth } from "@clerk/nextjs/server";
import { api } from "@workspace/backend/convex/_generated/api";
import { inngest } from "@workspace/jobs/inngest/client";
import { fetchMutation, fetchQuery } from "convex/nextjs";

export const verifyAccount = async (imageUrl: string) => {
  const result = await auth();
  const token = (await result.getToken({ template: "convex" })) ?? undefined;
  const user = await fetchQuery(api.functions.users.getUser, {}, { token });
  if (!user) {
    throw new Error("user is not present");
  }
  await fetchMutation(
    api.functions.verification.updateStatus,
    {
      userId: user._id,
    },
    { token },
  );
  await inngest.send({
    name: "test/verify-account",
    data: {
      imageUrl,
      user: {
        citizenId: user._id,
        email: user.email,
        name: user.fullName,
        dateOfBirth: user.dateOfBirth,
        permanentAddress: user.permanentAddress,
      },
    },
  });
};
