import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { InfisicalSDK } from "@infisical/sdk";
import Stripe from "stripe";
import { fetchMutation } from "convex/nextjs";
import { api } from "@workspace/backend/convex/_generated/api";

const client = new InfisicalSDK({
  siteUrl: "https://app.infisical.com",
});

export const requestSchema = z.object({
  amount: z
    .number()
    .min(20, { message: "minimum donation amount is 20 rupees" }),
  organizationId: z.string().min(1, { message: "organization id is required" }),
});

export async function POST(request: NextRequest) {
  try {
    const { userId, getToken } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "the user is not authenticated" },
        { status: 401 },
      );
    }
    const token = await getToken({ template: "convex" });
    if (!token) {
      return NextResponse.json(
        { error: "convex token is not present" },
        { status: 401 },
      );
    }
    const requestBody = await request.json();
    const parsedBody = requestSchema.safeParse(requestBody);
    if (!parsedBody.success) {
      return NextResponse.json(
        { error: parsedBody.error.errors },
        { status: 400 },
      );
    }
    await client.auth().universalAuth.login({
      clientId: process.env.MACHINE_ID!,
      clientSecret: process.env.MACHINE_SECRET!,
    });
    const publicKey = await client.secrets().getSecret({
      environment: "dev",
      projectId: process.env.PROJECT_ID!,
      secretName: `tenant_public_${parsedBody.data.organizationId}`,
      viewSecretValue: true,
    });
    const secretKey = await client.secrets().getSecret({
      environment: "dev",
      projectId: process.env.PROJECT_ID!,
      secretName: `tenant_secret_${parsedBody.data.organizationId}`,
      viewSecretValue: true,
    });
    const stripe = new Stripe(secretKey.secretValue);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: parsedBody.data.amount * 100,
      currency: "INR",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        type: "donation",
        organizationId: parsedBody.data.organizationId,
        userId,
      },
    });
    const result = await fetchMutation(api.functions.payments.createCheckout, {
      stripePaymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      donatedTo: parsedBody.data.organizationId,
    });
    return NextResponse.json(
      {
        success: true,
        checkoutId: result,
        publicKey: publicKey.secretValue,
        clientSecret: paymentIntent.client_secret,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "failed to create stripe session" },
      { status: 500 },
    );
  }
}
