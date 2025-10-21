import { headers as getHeaders, cookies as getCookies } from "next/headers";

import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";

import { signInSchema, signUpSchema } from "../schemas";

export const authRouter = createTRPCRouter({
  session: baseProcedure.query(async ({ ctx }) => {
    const headers = await getHeaders();
    const session = await ctx.db.auth({ headers });

    return session;
  }),

  signOut: baseProcedure.mutation(async () => {
    const cookies = await getCookies();
    cookies.delete("payload-token");
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
      console.log(existingUser.docs[0]);
      throw new TRPCError({
        code: "CONFLICT",
        message: "Username or email already taken",
      });
    }

    await ctx.db.create({
      collection: "users",
      data: {
        email: input.email,
        username: input.username,
        // This is hashed automatically
        password: input.password,
      },
    });

    // login after register
    const data = await ctx.db.login({
      collection: "users",
      data: {
        email: input.email,
        password: input.password,
      },
    });

    if (!data.token) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Sign in failed",
      });
    }

    const cookies = await getCookies();
    cookies.set({
      name: "payload-token",
      value: data.token,
      httpOnly: true,
      path: "/",
      // secure: true,
      // sameSite: "none",
      // domain: ""
      // TODO: ENSURE CROSS-DOMAIN COOKIE SHARING
    });
  }),

  signIn: baseProcedure.input(signInSchema).mutation(async ({ input, ctx }) => {
    const data = await ctx.db.login({
      collection: "users",
      data: {
        email: input.email,
        password: input.password,
      },
    });

    if (!data.token) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Sign in failed",
      });
    }

    const cookies = await getCookies();
    cookies.set({
      name: "payload-token",
      value: data.token,
      httpOnly: true,
      path: "/",
      // secure: true,
      // sameSite: "none",
      // domain: ""
      // TODO: ENSURE CROSS-DOMAIN COOKIE SHARING
    });

    return data;
  }),
});
