"use server";

import { auth } from "@clerk/nextjs/server";
import { api } from "@workspace/backend/convex/_generated/api";
import { index } from "@workspace/jobs/inngest/vectors/pinecone";
import { fetchQuery } from "convex/nextjs";

export const searchRelevantReports = async () => {
  try {
    const { getToken } = await auth();
    const token = await getToken({ template: "convex" });
    if (!token) {
      throw new Error("convex token not found");
    }
    const organization = await fetchQuery(
      api.functions.organizations.getOrganization,
      {},
      { token },
    );
    const searchText = `Goal of the organization: ${organization?.goal}. Purpose of the organization: ${organization?.purpose}`;
    const results = await index.searchRecords({
      query: {
        topK: 5,
        inputs: { text: searchText },
      },
      rerank: {
        model: "bge-reranker-v2-m3",
        topN: 5,
        rankFields: ["text"],
      },
      fields: ["inferredGoal", "inferredPurpose"],
    });
    results.result.hits.forEach((hit) => {
      console.log(hit);
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};
