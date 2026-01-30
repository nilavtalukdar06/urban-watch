import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { InfisicalSDK } from "@infisical/sdk";
import { fetchMutation } from "convex/nextjs";
import { api } from "@workspace/backend/convex/_generated/api";

const client = new InfisicalSDK({
  siteUrl: "https://app.infisical.com",
});

export async function DELETE(request: NextRequest) {
  try {
    const { userId, orgId, getToken } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "the user is not authenticated" },
        { status: 401 },
      );
    }
    if (!orgId) {
      return NextResponse.json(
        { error: "organization doesn't exist" },
        { status: 403 },
      );
    }
    const { keyId } = await request.json();
    if (!keyId) {
      return NextResponse.json(
        { error: "key id is not present on the request body" },
        { status: 404 },
      );
    }
    await client.auth().universalAuth.login({
      clientId: process.env.MACHINE_ID!,
      clientSecret: process.env.MACHINE_SECRET!,
    });
    await client.secrets().deleteSecret(`tenant_public_${orgId}`, {
      environment: "dev",
      projectId: process.env.PROJECT_ID!,
    });
    await client.secrets().deleteSecret(`tenant_secret_${orgId}`, {
      environment: "dev",
      projectId: process.env.PROJECT_ID!,
    });
    await client.secrets().deleteSecret(`tenant_webhook_${orgId}`, {
      environment: "dev",
      projectId: process.env.PROJECT_ID!,
    });
    const token = (await getToken({ template: "convex" })) ?? undefined;
    const result = await fetchMutation(
      api.functions.payments.deleteKeys,
      {
        apiId: keyId,
      },
      { token },
    );
    return NextResponse.json({ success: true, apiId: result }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "failed to delete the api keys" },
      { status: 500 },
    );
  }
}
