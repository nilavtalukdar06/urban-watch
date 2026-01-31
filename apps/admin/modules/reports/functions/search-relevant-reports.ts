import { index } from "@workspace/jobs/inngest/vectors/pinecone";

export const searchRelevantReports = async () => {
  try {
    // const result = await index.searchRecords()
  } catch (error) {
    console.error(error);
    throw error;
  }
};
