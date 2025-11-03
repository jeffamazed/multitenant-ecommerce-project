import z from "zod";

import { baseProcedure, createTRPCRouter } from "@/trpc/init";

import { DEFAULT_LIMIT_INFINITE_LOAD } from "@/lib/constants";

export const tagsRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        cursor: z.number().default(1),
        limit: z.number().default(DEFAULT_LIMIT_INFINITE_LOAD),
      })
    )
    .query(async ({ ctx, input }) => {
      let data;
      try {
        data = await ctx.db.find({
          collection: "tags",
          page: input.cursor,
          limit: input.limit,
        });
      } catch (error) {
        console.error(
          `[Tags GetMany] Failed to fetch tags - cursor: ${input.cursor}, limit: ${input.limit}, timestamp: ${new Date().toISOString()}`,
          error
        );
        throw new Error("Failed to fetch tags. Please try again later.");
      }

      return data;
    }),
});
