import { headers as getHeaders, cookies as getCookies } from "next/headers";
import { BasePayload } from "payload";

import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { stripe } from "@/lib/stripe";

import { signInSchema, signUpSchema } from "../schemas";
import { generateAuthCookie } from "../utils";

export const authRouter = createTRPCRouter({
  session: baseProcedure.query(async ({ ctx }) => {
    const headers = await getHeaders();
    const session = await ctx.db.auth({ headers });

    return session;
  }),

  signUp: baseProcedure.input(signUpSchema).mutation(async ({ input, ctx }) => {
    const existingUser = await ctx.db.find({
      collection: "users",
      limit: 1,
      where: {
        or: [
          { email: { equals: input.email } },
          { username: { equals: input.username } },
        ],
      },
    });

    if (existingUser.docs[0]) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "Username or email already taken.",
      });
    }

    const account = await stripe.accounts.create();

    if (!account) {
      console.error("Stripe account creation failed", {
        email: input.email,
        username: input.username,
        timestamp: new Date().toISOString(),
      });
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create Stripe account. Please try again later.",
      });
    }

    const tenant = await ctx.db.create({
      collection: "tenants",
      data: {
        name: input.username,
        slug: input.username,
        stripeAccountId: account.id,
      },
    });

    await ctx.db.create({
      collection: "users",
      data: {
        email: input.email,
        username: input.username,
        // This is hashed automatically
        password: input.password,
        tenants: [
          {
            tenant: tenant.id,
          },
        ],
      },
    });

    return signInHelper(input, ctx);
  }),

  signIn: baseProcedure.input(signInSchema).mutation(async ({ input, ctx }) => {
    return signInHelper(input, ctx);
  }),

  signOut: protectedProcedure.mutation(async ({ ctx }) => {
    const cookies = await getCookies();

    cookies.delete({
      name: `${ctx.db.config.cookiePrefix}-token`,
      path: "/",
      httpOnly: true,
      ...(process.env.NODE_ENV !== "development" && {
        sameSite: "none",
        domain: process.env.NEXT_PUBLIC_ROOT_DOMAIN!,
        secure: true,
      }),
    });

    cookies.delete({
      name: "payload-tenant",
      path: "/",
      ...(process.env.NODE_ENV !== "development" && {
        domain: process.env.NEXT_PUBLIC_ROOT_DOMAIN!,
      }),
    });
    return { success: true };
  }),
});

async function signInHelper(
  input: { email: string; password: string },
  ctx: { db: BasePayload }
) {
  let data;
  try {
    data = await ctx.db.login({
      collection: "users",
      data: {
        email: input.email,
        password: input.password,
      },
    });
  } catch {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Invalid email and/or password.",
    });
  }

  if (!data?.token) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Invalid email and/or password.",
    });
  }
  await generateAuthCookie({
    prefix: ctx.db.config.cookiePrefix,
    value: data.token,
  });

  return {};
}
