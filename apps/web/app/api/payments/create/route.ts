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
  organizationName: z
    .string()
    .min(1, { message: "organization name is required" }),
  amount: z
    .number()
    .min(100, { message: "minimum donation amount is 100 rupees" }),
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
    const secretKey = await client.secrets().getSecret({
      environment: process.env.ENV!,
      projectId: process.env.PROJECT_ID!,
      secretName: `tenant_secret_${parsedBody.data.organizationId}`,
      viewSecretValue: true,
    });
    const stripe = new Stripe(secretKey.secretValue);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `Donation to ${parsedBody.data.organizationName}`,
              description: `Support ${parsedBody.data.organizationName}`,
            },
            unit_amount: parsedBody.data.amount * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${request.headers.get("origin")}/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get("origin")}`,
      metadata: {
        type: "donation",
        organizationId: parsedBody.data.organizationId,
        userId,
      },
    });
    const result = await fetchMutation(
      api.functions.payments.createCheckout,
      {
        stripePaymentIntentId: session.id,
        amount: parsedBody.data.amount * 100,
        donatedTo: parsedBody.data.organizationId,
      },
      { token },
    );
    return NextResponse.json(
      {
        success: true,
        checkoutId: result,
        sessionId: session.id,
        checkoutUrl: session.url,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "failed to create stripe checkout session" },
      { status: 500 },
    );
  }
}
