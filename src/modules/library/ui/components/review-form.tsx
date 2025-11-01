import z from "zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { ReviewsGetOneOutput } from "@/modules/reviews/types";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { baseReviewSchema } from "@/modules/reviews/schemas";
import { StarPicker } from "@/components/shared/star-picker";
import { toast } from "sonner";

interface Props {
  productId: string;
  initialData?: ReviewsGetOneOutput;
}

type ReviewFormSchemaType = z.infer<typeof baseReviewSchema>;

export const ReviewForm = ({ productId, initialData }: Props) => {
  const [isPreview, setIsPreview] = useState<boolean>(!!initialData);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { mutate: mutateCreateReview } = useMutation(
    trpc.reviews.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.reviews.getOne.queryFilter({
            productId,
          })
        );
        setIsPreview(true);

        toast.success("Thank you for the review!");
      },
      onError: (error) => {
        toast.error(error.message);
      },
      onSettled: () => setIsLoading(false),
    })
  );

  const { mutate: mutateUpdateReview } = useMutation(
    trpc.reviews.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.reviews.getOne.queryFilter({
            productId,
          })
        );
        setIsPreview(true);

        toast.success("Review updated successfully!");
      },
      onError: (error) => {
        toast.error(error.message);
      },
      onSettled: () => setIsLoading(false),
    })
  );

  const form = useForm<ReviewFormSchemaType>({
    resolver: zodResolver(baseReviewSchema),
    defaultValues: {
      rating: initialData?.rating ?? 0,
      description: initialData?.description ?? "",
    },
  });

  const onSubmit = (values: ReviewFormSchemaType) => {
    setIsLoading(true);
    if (initialData) {
      mutateUpdateReview({
        reviewId: initialData.id,
        rating: values.rating,
        description: values.description,
      });
    } else {
      mutateCreateReview({
        productId,
        rating: values.rating,
        description: values.description,
      });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {isPreview && (
        <Button
          onClick={() => setIsPreview(false)}
          size="sm"
          type="button"
          variant="elevated"
          className="w-fit self-end"
        >
          Edit <span className="sr-only">this review</span>
        </Button>
      )}
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <h3 className="font-medium text-lg mb-2">
          {isPreview ? "You reviewed this product!" : "Share your thoughts!"}
        </h3>
        <FieldSet>
          <FieldLegend className="sr-only">
            Product Review Information
          </FieldLegend>

          <FieldGroup className="gap-4">
            {/* RATING */}
            <Controller
              name="rating"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <div className="flex items-center gap-2">
                    <FieldLabel
                      id="review-rating-product"
                      className="text-base"
                    >
                      Your rating:
                    </FieldLabel>
                    <div role="group" aria-labelledby="review-rating-product">
                      <StarPicker
                        value={field.value}
                        onChange={field.onChange}
                        disabled={isPreview}
                      />
                    </div>
                  </div>

                  {/* FOR SR WHEN PREVIEWING */}
                  {isPreview && (
                    <FieldDescription
                      className="sr-only"
                      aria-labelledby="review-rating-product"
                    >
                      {field.value} {field.value === 1 ? "star" : "stars"}
                    </FieldDescription>
                  )}
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* DESCRIPTION */}
            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel
                    htmlFor="review-description-product"
                    className="text-base gap-0"
                  >
                    Your review
                    {!isPreview && (
                      <span className="text-sm text-muted-foreground">
                        &nbsp;(optional)
                      </span>
                    )}
                    :
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id="review-description-product"
                    placeholder={
                      !isPreview ? "Leave a review" : "No reviews yet..."
                    }
                    readOnly={isPreview}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </FieldSet>

        {!isPreview && (
          <Button
            variant="elevated"
            disabled={isLoading}
            type="submit"
            size="lg"
            className="bg-black text-white hover:bg-custom-accent hover:text-foreground focus-visible:bg-custom-accent focus-visible:text-foreground w-fit mt-2"
          >
            {initialData && "Update review"}
            {!initialData && "Post review"}
          </Button>
        )}
      </form>
    </div>
  );
};
