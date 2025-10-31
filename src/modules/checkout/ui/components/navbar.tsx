import Link from "next/link";

import { generateTenantURL } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Props {
  slug: string;
}

export const Navbar = ({ slug }: Props) => {
  return (
    <header className="border-b sticky top-0 left-0 bg-white z-50 w-full h-18">
      <nav className="common-padding-x max-container size-full flex justify-between items-center overflow-x-auto gap-4">
        <span className="common-heading-span">Checkout</span>

        <Button asChild variant="elevated">
          <Link href={generateTenantURL(slug)}>Continue shopping</Link>
        </Button>
      </nav>
    </header>
  );
};
