"use server";
import { index } from "@workspace/jobs/inngest/vectors/pinecone";

type FormData = {
  goal: string;
  purpose: string;
};

export const upsertVector = async ({ goal, purpose }: FormData) => {
  try {
    const record = { goal, purpose };
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
