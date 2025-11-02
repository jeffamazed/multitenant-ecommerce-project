"use client";
import Link from "next/link";
import Image from "next/image";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

import AvatarPlaceholder from "@/app/assets/img/avatar_placeholder_small.png";
import { generateTenantURL } from "@/lib/utils";
import { CheckoutButton } from "@/modules/checkout/ui/components/checkout-button";

interface Props {
  slug: string;
}

export const Navbar = ({ slug }: Props) => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.tenants.getOne.queryOptions({ slug }));

  return (
    <header className="border-b sticky top-0 left-0 bg-white z-50 w-full h-18">
      <nav className="common-padding-x max-container size-full flex justify-between items-center overflow-x-auto gap-4">
        <Link
          href={generateTenantURL(slug)}
          className="flex items-center gap-2"
        >
          <Image
            src={data.image?.url || AvatarPlaceholder}
            width={32}
            height={32}
            className="rounded-full border shrink-0 size-[32px]"
            alt={`${slug}'s avatar`}
            priority
          />
          <span className="common-heading-span line-clamp-1">
            <span className="sr-only">View tenant of </span>
            {data.name}
          </span>
        </Link>

        <CheckoutButton tenantSlug={slug} />
      </nav>
    </header>
  );
};
