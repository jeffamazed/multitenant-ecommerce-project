import z from "zod";

import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";

import { createReviewFormSchema, updateReviewFormSchema } from "../schemas";

export const reviewsRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const product = await ctx.db.findByID({
        collection: "products",
        id: input.productId,
      });

      if (!product) {
        console.error(
          `[Reviews GetOne] Failed to fetch product - id: ${input.productId}`,
          `timestamp: ${new Date().toISOString()}`
        );
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found.",
        });
      }

      const reviewsData = await ctx.db.find({
        collection: "reviews",
        limit: 1,
        where: {
          and: [
            {
              product: {
                equals: product.id,
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

      const review = reviewsData.docs[0];

      if (!review) {
        console.info(
          `[Reviews GetOne] No review found for user - userId: ${ctx.session.user.id}, productId: ${input.productId}, timestamp: ${new Date().toISOString()}`
        );

        return null;
      }

      return review;
    }),

  create: protectedProcedure
    .input(createReviewFormSchema)
    .mutation(async ({ input, ctx }) => {
      const product = await ctx.db.findByID({
        collection: "products",
        id: input.productId,
      });

      if (!product) {
        console.error(
          `[Reviews Create] Product not found - id: ${input.productId}, userId: ${ctx.session.user.id}, timestamp: ${new Date().toISOString()}`
        );
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found.",
        });
      }

      const existingReviewsData = await ctx.db.find({
        collection: "reviews",
        where: {
          and: [
            {
              product: { equals: input.productId },
            },
            {
              user: { equals: ctx.session.user.id },
            },
          ],
        },
      });

      // check if already exists
      if (existingReviewsData.totalDocs > 0) {
        console.warn(
          `[Reviews Create] User already submitted review - userId: ${ctx.session.user.id}, productId: ${input.productId}, timestamp: ${new Date().toISOString()}`
        );
        throw new TRPCError({
          code: "CONFLICT",
          message: "You have already submitted a review for this product.",
        });
      }

      const review = await ctx.db.create({
        collection: "reviews",
        data: {
          user: ctx.session.user.id,
          product: product.id,
          rating: input.rating,
          description: input.description,
        },
      });

      // update product score
      await ctx.db.update({
        collection: "products",
        id: product.id,
        data: {
          score: (product.score || 0) + 1,
        },
      });

      return review;
    }),

  update: protectedProcedure
    .input(updateReviewFormSchema)
    .mutation(async ({ input, ctx }) => {
      const existingReview = await ctx.db.findByID({
        collection: "reviews",
        id: input.reviewId,
        depth: 0,
      });

      if (!existingReview) {
        console.warn(
          `[Reviews Update] Review not found - reviewId: ${input.reviewId}, userId: ${ctx.session.user.id}, timestamp: ${new Date().toISOString()}`
        );

        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Review not found.",
        });
      }

      if (existingReview.user !== ctx.session.user.id) {
        console.warn(
          `[Reviews Update] Unauthorized update attempt - reviewId: ${input.reviewId}, userId: ${ctx.session.user.id}, timestamp: ${new Date().toISOString()}`
        );
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not allowed to update this review.",
        });
      }

      const updatedReview = await ctx.db.update({
        collection: "reviews",
        id: input.reviewId,
        data: {
          ...(input.rating !== undefined && { rating: input.rating }),
          ...(input.description !== undefined && {
            description: input.description,
          }),
        },
      });

      return updatedReview;
    }),
});
