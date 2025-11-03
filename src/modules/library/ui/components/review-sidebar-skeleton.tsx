import { StarPicker } from "@/components/shared/star-picker";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldSet } from "@/components/ui/field";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

export const ReviewSidebarSkeleton = () => {
  return (
    <div className="p-4 bg-white rounded-md border" aria-hidden="true">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <Skeleton className="bg-skeleton w-40 h-7 mb-4" />
          <FieldSet>
            <FieldGroup className="gap-4">
              {/* RATING */}

              <Field>
                <div className="flex items-center gap-2">
                  <Skeleton className="bg-skeleton w-20 h-5" />
                  <div role="group" aria-labelledby="review-rating-product">
                    <StarPicker value={5} disabled={true} />
                  </div>
                </div>
              </Field>

              {/* DESCRIPTION */}

              <Field>
                <Skeleton className="bg-skeleton w-24! h-5" />
                <Textarea
                  id="review-description-product"
                  disabled={true}
                  className={`min-h-[80px] resize-none`}
                />
              </Field>
            </FieldGroup>
          </FieldSet>

          <Button
            variant="elevated"
            disabled={true}
            type="submit"
            size="lg"
            className="bg-black text-white hover:bg-custom-accent hover:text-foreground focus-visible:bg-custom-accent focus-visible:text-foreground w-fit mt-2"
          >
            Post review
          </Button>
        </div>
      </div>
    </div>
  );
};
