import { Suspense } from "react";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient, trpc } from "@/trpc/server";

import { Footer } from "./footer";
import { Navbar } from "./navbar";
import { SearchFilters } from "./search-filters/search-filters";
import { SearchInputSkeleton } from "./search-filters/search-input-skeleton";

interface Props {
  children: React.ReactNode;
}

const Layout = async ({ children }: Props) => {
  const queryClient = getQueryClient();
  // void to ignore the returned promise
  void queryClient.prefetchQuery(trpc.categories.getMany.queryOptions());

  return (
    <div className="flex flex-col min-h-dvh overflow-x-hidden">
      <Navbar />

      <main className="flex-1 bg-zinc-100">
        <section
          className="flex-cent border-b"
          style={{ backgroundColor: "oklch(0.98 0.01 237)" }}
        >
          <div className="max-container common-padding">
            <h1 className="text-center text-2xl md:text-3xl mb-6 lg:mb-8 font-semibold">
              One Platform. Every Store. Seamlessly.
            </h1>

            <HydrationBoundary state={dehydrate(queryClient)}>
              <Suspense fallback={<SearchInputSkeleton />}>
                <SearchFilters />
              </Suspense>
            </HydrationBoundary>
          </div>
        </section>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
