import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { InfisicalSDK } from "@infisical/sdk";
import { fetchMutation } from "convex/nextjs";
import { api } from "@workspace/backend/convex/_generated/api";

const client = new InfisicalSDK({
  siteUrl: "https://app.infisical.com",
});

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = (await headers()).get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }
  try {
    const rawEvent = JSON.parse(body) as Stripe.Event;

    let organizationId: string | undefined;
    let sessionId: string | undefined;

    if (rawEvent.type.startsWith("checkout.session")) {
      const session = rawEvent.data.object as Stripe.Checkout.Session;
      organizationId = session.metadata?.organizationId;
      sessionId = session.id;
    } else if (rawEvent.type.startsWith("payment_intent")) {
      const paymentIntent = rawEvent.data.object as Stripe.PaymentIntent;
      organizationId = paymentIntent.metadata?.organizationId;
    }

    if (!organizationId) {
      return NextResponse.json(
        { error: "Organization ID not found in metadata" },
        { status: 400 },
      );
    }
    await client.auth().universalAuth.login({
      clientId: process.env.MACHINE_ID!,
      clientSecret: process.env.MACHINE_SECRET!,
    });
    const webhookSecret = await client.secrets().getSecret({
      environment: "dev",
      projectId: process.env.PROJECT_ID!,
      secretName: `tenant_webhook_${organizationId}`,
      viewSecretValue: true,
    });
    const secretKey = await client.secrets().getSecret({
      environment: "dev",
      projectId: process.env.PROJECT_ID!,
      secretName: `tenant_secret_${organizationId}`,
      viewSecretValue: true,
    });
    const stripe = new Stripe(secretKey.secretValue);
    let verifiedEvent: Stripe.Event;
    try {
      verifiedEvent = stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret.secretValue,
      );
    } catch (err) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
    switch (verifiedEvent.type) {
      case "checkout.session.completed": {
        const session = verifiedEvent.data.object as Stripe.Checkout.Session;
        await fetchMutation(api.functions.payments.updateDonationStatus, {
          stripePaymentIntentId: session.id,
          status: "paid",
        });
        break;
      }
      case "checkout.session.expired":
      case "payment_intent.payment_failed": {
        const failedSession = verifiedEvent.data.object as
          | Stripe.Checkout.Session
          | Stripe.PaymentIntent;
        await fetchMutation(api.functions.payments.updateDonationStatus, {
          stripePaymentIntentId: failedSession.id,
          status: "failed",
        });
        break;
      }
      default:
        console.log(`Unhandled event type: ${verifiedEvent.type}`);
    }
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 },
    );
  }
}
