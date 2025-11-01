import z from "zod";

import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { Media, Tenant } from "@/payload-types";
import { DEFAULT_LIMIT_INFINITE_LOAD } from "@/lib/constants";

export const libraryRouter = createTRPCRouter({
  getMany: protectedProcedure
    .input(
      z.object({
        cursor: z.number().default(1),
        limit: z.number().default(DEFAULT_LIMIT_INFINITE_LOAD),
      })
    )
    .query(async ({ ctx, input }) => {
      const ordersData = await ctx.db.find({
        collection: "orders",
        depth: 0, // Only gettings ids without populating
        page: input.cursor,
        limit: input.limit,
        where: {
          user: {
            equals: ctx.session.user.id,
          },
        },
      });

      const productIds = ordersData.docs.map((o) => o.product);

      const productsData = await ctx.db.find({
        collection: "products",
        pagination: false,
        where: {
          id: {
            in: productIds,
          },
        },
      });

      return {
        ...productsData,
        docs: productsData.docs.map((doc) => ({
          ...doc,
          image: doc.image as Media | null,
          tenant: doc.tenant as Tenant & { image: Media | null },
        })),
      };
    }),
});
