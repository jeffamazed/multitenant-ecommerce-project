import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import { ProductList } from "../components/product-list";
import { ProductListSkeleton } from "../components/product-list-skeleton";

export const LibraryView = () => {
  return (
    <div className="flex flex-col min-h-dvh">
      <header className="border-b sticky top-0 left-0 bg-custom-accent z-50 w-full h-18">
        <nav className="common-padding-x max-container size-full flex justify-between items-center overflow-x-auto gap-4">
          <Button asChild variant="elevated">
            <Link prefetch href="/">
              <ArrowLeftIcon className="size-4" />
              Continue shopping
            </Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1 bg-zinc-100">
        <header className="bg-custom-accent-secondary border-b">
          <div className="common-padding max-container">
            <h1>Library</h1>
            <p className="font-medium text-base lg:text-xl mt-2 lg:mt-4">
              Your purchases and reviews
            </p>
          </div>
        </header>

        <section className="common-padding max-container">
          <Suspense fallback={<ProductListSkeleton />}>
            <ProductList />
          </Suspense>
        </section>
      </main>
    </div>
  );
};
