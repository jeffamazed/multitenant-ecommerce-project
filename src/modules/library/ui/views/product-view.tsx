"use client";

import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { ReviewSidebar } from "../components/review-sidebar";

interface Props {
  productId: string;
}

export const ProductView = ({ productId }: Props) => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.library.getOne.queryOptions({
      productId,
    })
  );

  return (
    <div className="flex flex-col min-h-dvh">
      <header className="border-b sticky top-0 left-0 bg-custom-accent z-50 w-full h-18">
        <nav className="common-padding-x max-container size-full flex justify-between items-center overflow-x-auto gap-4">
          <Button asChild variant="elevated">
            <Link prefetch href="/library">
              <ArrowLeftIcon className="size-4" />
              Back to Library
            </Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1 bg-zinc-100">
        <header className="bg-custom-accent-secondary border-b">
          <div className="common-padding max-container">
            <h1>{data.name}</h1>
          </div>
        </header>

        <section className="common-padding max-container">
          <h2 className="text-xl lg:text-2xl font-medium common-margin-bottom">
            Product Details & Review
          </h2>
          <div className="common-grid-setup">
            <div className="md:col-span-4 lg:col-span-3">
              <ReviewSidebar productId={productId} />
            </div>

            <div className="md:col-span-6 lg:col-span-7">
              {data.content ? (
                <p>{data.content}</p>
              ) : (
                <p className="font-medium italic text-muted-foreground">
                  No special content
                </p>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
