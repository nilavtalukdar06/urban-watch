"use server";

import { auth } from "@clerk/nextjs/server";
import { api } from "@workspace/backend/convex/_generated/api";
import { index } from "@workspace/jobs/inngest/vectors/pinecone";
import { fetchQuery } from "convex/nextjs";

export const searchRelevantReports = async (): Promise<string[]> => {
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
    if (!organization) {
      throw new Error("Organization not found");
    }
    if (!organization.goal && !organization.purpose) {
      throw new Error("Organization goal and purpose are not set");
    }
    const searchText = `Goal of the organization: ${organization.goal || "N/A"}. Purpose of the organization: ${organization.purpose || "N/A"}`;
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
    const reportIds = results.result.hits
      .map((hit) => {
        const id = (hit as { _id?: string })._id;
        return id;
      })
      .filter((id): id is string => Boolean(id));
    return reportIds;
  } catch (error) {
    console.error("Error searching relevant reports:", error);
    throw error;
  }
};
