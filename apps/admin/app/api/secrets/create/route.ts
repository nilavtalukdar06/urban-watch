import { auth } from "@clerk/nextjs/server";
import { InfisicalSDK } from "@infisical/sdk";
import { api } from "@workspace/backend/convex/_generated/api";
import { fetchMutation } from "convex/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const requestSchema = z.object({
  keyName: z.string().min(2),
  publicKey: z.string().min(5),
  secretKey: z.string().min(5),
});

export async function POST(request: NextRequest) {
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
    const requestBody = await request.json();
    const parsedSchema = requestSchema.safeParse(requestBody);
    if (!parsedSchema.success) {
      return NextResponse.json(
        { error: "invalid key format" },
        { status: 400 },
      );
    }
    const token = (await getToken({ template: "convex" })) ?? undefined;
    const client = new InfisicalSDK({
      siteUrl: "https://app.infisical.com",
    });
    await client.auth().universalAuth.login({
      clientId: process.env.MACHINE_ID!,
      clientSecret: process.env.MACHINE_SECRET!,
    });
    const publicKey = await client
      .secrets()
      .createSecret(`tenant_public_${orgId}`, {
        environment: "dev",
        projectId: process.env.PROJECT_ID!,
        secretValue: parsedSchema.data.publicKey,
      });
    const secretKey = await client
      .secrets()
      .createSecret(`tenant_secret_${orgId}`, {
        environment: "dev",
        projectId: process.env.PROJECT_ID!,
        secretValue: parsedSchema.data.secretKey,
      });
    const result = await fetchMutation(
      api.functions.payments.saveKeys,
      {
        keyName: parsedSchema.data.keyName,
        publicKeyPrefix: publicKey.secret.secretValue.slice(0, 9),
        secretKeyPrefix: secretKey.secret.secretValue.slice(0, 9),
      },
      { token },
    );
    return NextResponse.json({ success: true, keyId: result }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "failed to create secret" },
      { status: 500 },
    );
  }
}
