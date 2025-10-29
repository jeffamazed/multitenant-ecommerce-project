import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SlashIcon } from "lucide-react";
import { memo } from "react";

interface Props {
  activeCategoryName: string | null;
  activeCategory?: string | null;
  activeSubcategoryName: string | null;
}

export const BreadcrumbNavigation = memo(function BreadcrumbNavigation({
  activeCategoryName,
  activeCategory,
  activeSubcategoryName,
}: Props) {
  if (!activeCategoryName || activeCategory === "all") return null;

  return (
    <Breadcrumb>
      <BreadcrumbList className="text-lg text-primary font-medium common-margin-top">
        {activeSubcategoryName ? (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`${activeCategory}`}>{activeCategoryName}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator
              aria-hidden="true"
              className="pointer-events-none select-none"
            >
              <SlashIcon />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage className="underline">
                {activeSubcategoryName}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        ) : (
          <BreadcrumbItem>
            <BreadcrumbLink asChild className="underline">
              <Link href={`${activeCategory}`}>{activeCategoryName}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
});
