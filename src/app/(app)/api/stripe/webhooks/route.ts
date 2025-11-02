import type { Stripe } from "stripe";
import { getPayload } from "payload";
import { NextResponse } from "next/server";

import config from "@payload-config";
import { stripe } from "@/lib/stripe";
import { CheckoutMetadata, ExpandedLineItem } from "@/modules/checkout/types";

class WebhookError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

export async function POST(req: Request) {
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      await (await req.blob()).text(),
      req.headers.get("stripe-signature") as string,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: unknown) {
    // Determine if it’s a standard JS error
    const isJSError = error instanceof Error;
    const errorMessage = isJSError ? error.message : "Unknown error";

    // Log everything for debugging
    console.error("Webhook error:", error);

    // Return JSON with appropriate status
    return NextResponse.json(
      { message: `Webhook Error: ${errorMessage}` },
      { status: isJSError ? 500 : 400 }
    );
  }
  console.log("Stripe Success:", event.id);

  const permittedEvents: string[] = [
    "checkout.session.completed",
    "account.updated",
  ];

  const payload = await getPayload({ config });

  if (permittedEvents.includes(event.type)) {
    let data;

    try {
      switch (event.type) {
        case "checkout.session.completed":
          console.log("PURCHASE ATTEMPT");
          data = event.data.object as Stripe.Checkout.Session & {
            metadata: CheckoutMetadata;
          };

          if (!data.metadata?.userId) {
            throw new WebhookError("User ID is required.", 400);
          }

          const user = await payload.findByID({
            collection: "users",
            id: data.metadata.userId,
          });

          if (!user) {
            throw new WebhookError("User not found.", 404);
          }

          const expandedSession = await stripe.checkout.sessions.retrieve(
            data.id,
            {
              expand: ["line_items.data.price.product"],
            },
            {
              stripeAccount: event.account,
            }
          );

          if (
            !expandedSession.line_items?.data ||
            !expandedSession.line_items.data.length
          ) {
            throw new WebhookError("No line items found.", 400);
          }

          const lineItems = expandedSession.line_items
            .data as ExpandedLineItem[];

          for (const item of lineItems) {
            await payload.create({
              collection: "orders",
              data: {
                stripeCheckoutSessionId: data.id,
                stripeAccountId: event.account,
                user: user.id,
                product: item.price.product.metadata.id,
                name: item.price.product.metadata.name,
              },
            });
          }
          break;

        case "account.updated":
          data = event.data.object as Stripe.Account;

          await payload.update({
            collection: "tenants",
            where: {
              stripeAccountId: {
                equals: data.id,
              },
            },
            data: {
              stripeDetailsSubmitted:
                data.details_submitted &&
                data.requirements?.currently_due?.length === 0,
            },
          });

          break;
        default:
          throw new Error(`Unhandled event: ${event.type}`);
      }
    } catch (error: unknown) {
      let message;
      const status = error instanceof WebhookError ? error.statusCode : 500;

      if (error instanceof WebhookError) {
        message = `Stripe error: ${error.message}.`;
        console.error("Stripe event error:", error);
      } else {
        message = "Internal server error.";
        console.error(error);
      }

      return NextResponse.json({ message }, { status });
    }
  }
  return NextResponse.json({ message: "Received" }, { status: 200 });
}
