"use server";
import { index } from "@workspace/jobs/inngest/vectors/pinecone";

type FormData = {
  _id: string;
  goal: string;
  purpose: string;
};

export const upsertVector = async ({ _id, goal, purpose }: FormData) => {
  try {
    const record = {
      id: _id,
      goal,
      purpose,
      text: `Goal of the organization: ${goal}. Purpose of the organization: ${purpose}`,
    };
    await index.upsertRecords([record]);
    return {
      success: true,
      message: "upserted vector",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "failed to create vector",
    };
  }
};
