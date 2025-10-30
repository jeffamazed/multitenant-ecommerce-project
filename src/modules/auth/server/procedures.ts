import { headers as getHeaders } from "next/headers";
import { BasePayload } from "payload";

import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";

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

    const tenant = await ctx.db.create({
      collection: "tenants",
      data: {
        name: input.username,
        slug: input.username,
        stripeAccountId: "test",
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

  // TODO: PROBABLY DON'T SEND DATA IF NOT NEEDED
  return data;
}
