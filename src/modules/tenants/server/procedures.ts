import z from "zod";

import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";

import { Media, Tenant } from "@/payload-types";

export const tenantsRouter = createTRPCRouter({
  getOne: baseProcedure
    .input(
      z.object({
        slug: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      let tenantsData;
      try {
        tenantsData = await ctx.db.find({
          collection: "tenants",
          depth: 1, // "tenant.image" is a type of "Media"
          where: {
            slug: {
              equals: input.slug,
            },
          },
          limit: 1,
          pagination: false,
        });
      } catch (error) {
        console.error(
          `[Tenants GetOne] Failed to fetch tenant - slug: ${input.slug}, timestamp: ${new Date().toISOString()}`,
          error
        );
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch tenant. Please try again later.",
        });
      }

      const tenant = tenantsData.docs[0];

      if (!tenant) {
        console.error(
          `[Tenants GetOne] Tenant not found - slug: ${input.slug}, timestamp: ${new Date().toISOString()}`
        );
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tenant not found.",
        });
      }

      return tenant as Tenant & { image: Media | null };
    }),
});
