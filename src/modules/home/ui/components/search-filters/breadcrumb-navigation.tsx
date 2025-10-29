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

interface Props {
  activeCategoryName: string | null;
  activeCategory?: string | null;
  activeSubcategoryName: string | null;
}

export const BreadcrumbNavigation = ({
  activeCategoryName,
  activeCategory,
  activeSubcategoryName,
}: Props) => {
  if (!activeCategoryName || activeCategory === "all") return null;

  return (
    <Breadcrumb>
      <BreadcrumbList className="text-lg text-primary font-medium mt-4">
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
};
