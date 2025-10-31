import Image from "next/image";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn, formatCurrency } from "@/lib/utils";

import ProductPlaceholderMedium from "@/app/assets/img/product_placeholder_medium.png";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Props {
  isLast?: boolean;
  isFirst?: boolean;
  imageUrl?: string | null;
  name: string;
  productUrl: string;
  tenantUrl: string;
  tenantName: string;
  id: string;
  price: number;
  onRemove: (id: string) => void;
}

export const CheckoutItem = ({
  isLast,
  isFirst,
  imageUrl,
  name,
  productUrl,
  tenantUrl,
  tenantName,
  id,
  price,
  onRemove,
}: Props) => {
  return (
    <article
      className={cn(
        "grid grid-cols-[6rem_1fr_auto] sm:grid-cols-[7.5rem_1fr_auto] md:grid-cols-[8.5rem_1fr_auto] xl:grid-cols-[10rem_1fr_auto] gap-2 sm:gap-4 pr-2 sm:pr-4 border-t border-l border-r overflow-x-auto bg-white",
        {
          "border-b rounded-b-md": isLast,
          "rounded-t-md": isFirst,
        }
      )}
    >
      <div className="overflow-hidden border-r">
        <AspectRatio ratio={1} className="relative">
          <Image
            src={imageUrl || ProductPlaceholderMedium}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
            placeholder="blur"
          />
        </AspectRatio>
      </div>

      <div className="py-2 sm:py-4 flex flex-col justfiy-between">
        <div className="flex flex-col gap-1 sm:gap-2">
          <Link href={productUrl} className="w-fit">
            <h3 className="font-bold underline text-base lg:text-xl leading-tight line-clamp-2">
              <span className="sr-only">Visit product </span>
              {name}
            </h3>
          </Link>
          <Link href={tenantUrl} className="w-fit">
            <span className="font-medium underline text-sm lg:text-base line-clamp-1">
              <span className="sr-only">Visit tenant of </span>
              {tenantName}
            </span>
          </Link>
        </div>
      </div>

      <div className="py-2 sm:py-4 flex flex-col justify-between">
        <span className="font-medium text-sm lg:text-base text-right">
          <span className="sr-only">Price of product: </span>
          {formatCurrency(price)}
        </span>
        <Button
          variant="customLink"
          aria-label={`Remove product ${name}`}
          onClick={() => onRemove(id)}
          className="text-sm lg:text-base"
        >
          Remove
        </Button>
      </div>
    </article>
  );
};
