import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
import { CircleXIcon } from "lucide-react";

interface Props {
  total: number | undefined;
  onPurchase: () => void;
  isCanceled?: boolean;
  disabled?: boolean;
  isLoading: boolean;
}

export const CheckoutSidebar = ({
  total,
  onPurchase,
  isCanceled,
  disabled,
  isLoading,
}: Props) => {
  return (
    <div className="border rounded-md overflow-hidden bg-white flex flex-col">
      <dl className="flex items-center justify-between p-4 border-b">
        <dt className="font-medium text-base md:text-lg">Total</dt>
        <dl className="text-base md:text-lg">
          {isLoading ? (
            <Skeleton className="w-16 h-6 bg-skeleton" />
          ) : (
            <strong>{formatCurrency(total)}</strong>
          )}
        </dl>
      </dl>

      <div className="p-4">
        <Button
          variant="elevated"
          disabled={disabled || isLoading}
          size="lg"
          onClick={onPurchase}
          className="text-base text-white bg-primary w-full hover:bg-custom-accent hover:text-primary focus-visible:bg-custom-accent focus-visible:text-primary"
        >
          Checkout
        </Button>
      </div>

      {isCanceled && (total ?? 0) > 0 && (
        <div className="p-4 border-t">
          <Alert
            variant="destructive"
            className="rounded-md bg-destructive/30 overflow-hidden border-red-700"
          >
            <AlertTitle className="flex items-center gap-2">
              <CircleXIcon className="size-6! stroke-red-300 fill-red-600" />
              <h3 className="text-red-600 text-lg">Checkout Error!</h3>
            </AlertTitle>
            <AlertDescription>
              <p className="text-red-600/90 text-sm">
                Sorry. We couldn&apos;t complete your checkout.
              </p>
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
};
