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

      if (!review) return null;

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
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Review not found.",
        });
      }

      if (existingReview.user !== ctx.session.user.id) {
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
