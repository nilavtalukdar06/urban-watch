"use server";

import { auth } from "@clerk/nextjs/server";
import { api } from "@workspace/backend/convex/_generated/api";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { inngest } from "@workspace/jobs/inngest/client";

interface ReportData {
  imageUrl: string;
  location: string;
  notes: string;
}

export const submitReport = async (data: ReportData) => {
  try {
    const result = await auth();
    const token = (await result.getToken({ template: "convex" })) ?? undefined;
    const user = await fetchQuery(api.functions.users.getUser, {}, { token });
    if (!user) {
      throw new Error("User is not authenticated");
    }
    const verificationStatus = await fetchQuery(
      api.functions.users.checkVerificationStatus,
      {},
      { token },
    );
    if (!verificationStatus || !verificationStatus.isAuthorized) {
      throw new Error("You are not authorized to submit reports. Please complete verification first.");
    }
    const reportId = await fetchMutation(
      api.functions.reports.createReport,
      {
        imageUrl: data.imageUrl,
        location: data.location,
        notes: data.notes,
      },
      { token },
    );
    await inngest.send({
      name: "report/analyze",
      data: {
        reportId,
        userId: user.userId,
        imageUrl: data.imageUrl,
        location: data.location,
        notes: data.notes,
      },
    });
    return {
      success: true,
      reportId,
      message: "Report submitted successfully",
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};
