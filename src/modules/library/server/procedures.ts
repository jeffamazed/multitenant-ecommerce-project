import z from "zod";

import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { Media, Tenant } from "@/payload-types";
import { DEFAULT_LIMIT_INFINITE_LOAD } from "@/lib/constants";
import { TRPCError } from "@trpc/server";

export const libraryRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const ordersData = await ctx.db.find({
        collection: "orders",
        limit: 1,
        pagination: false,
        where: {
          and: [
            {
              product: {
                equals: input.productId,
              },
            },
            {
              user: {
                equals: ctx.session.user.id,
              },
            },
          ],
        },
      });

      const order = ordersData.docs[0];
      if (!order) {
        console.error(
          `[Library GetOne] Order not found - user: ${ctx.session.user.id}, product: ${input.productId}, timestamp: ${new Date().toISOString()}`
        );
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Order not found.",
        });
      }

      const product = await ctx.db.findByID({
        collection: "products",
        id: input.productId,
      });

      if (!product) {
        console.error(
          `[Library GetOne] Product not found - productId: ${input.productId}, timestamp: ${new Date().toISOString()}`
        );
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found.",
        });
      }

      return product;
    }),

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

      if (!ordersData.docs.length) {
        console.error(
          `[Library GetMany] No orders found for user: ${ctx.session.user.id}, cursor: ${input.cursor}, timestamp: ${new Date().toISOString()}`
        );
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No orders found.",
        });
      }

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

      if (!productsData.docs.length) {
        console.error(
          `[Library GetMany] Products not found for user: ${ctx.session.user.id}, productIds: ${productIds.join(", ")}, timestamp: ${new Date().toISOString()}`
        );
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No products found.",
        });
      }

      const allReviews = await ctx.db.find({
        collection: "reviews",
        pagination: false,
        depth: 0,
        where: {
          product: { in: productIds },
        },
      });

      // group reviews by product id
      const reviewsByProduct = allReviews.docs.reduce(
        (acc, review) => {
          const productId = review.product as string;
          if (!acc[productId]) acc[productId] = [];
          acc[productId].push(review);

          return acc;
        },
        {} as Record<string, typeof allReviews.docs>
      );

      const docsWithReviews = productsData.docs.map((doc) => {
        const reviews = reviewsByProduct[doc.id] || [];
        const reviewCount = reviews.length;
        const reviewRating =
          reviewCount > 0
            ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount
            : 0;

        return { ...doc, reviewCount, reviewRating };
      });

      return {
        ...productsData,
        docs: docsWithReviews.map((doc) => ({
          ...doc,
          image: doc.image as Media | null,
          tenant: doc.tenant as Tenant & { image: Media | null },
        })),
      };
    }),
});
