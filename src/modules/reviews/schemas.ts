import z from "zod";

export const baseReviewSchema = z.object({
  rating: z
    .number()
    .min(1, { error: "Minimum rating is 1." })
    .max(5, { error: "Maximum rating is 5." }),
  description: z.string().trim().optional(),
});

export const createReviewFormSchema = baseReviewSchema.extend({
  productId: z.string(),
});

export const updateReviewFormSchema = baseReviewSchema.partial().extend({
  reviewId: z.string(),
});
