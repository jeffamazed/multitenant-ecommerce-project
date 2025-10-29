import { Suspense } from "react";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient, trpc } from "@/trpc/server";

import { Footer } from "@/modules/home/ui/components/footer";
import { Navbar } from "@/modules/home/ui/components/navbar";
import { SearchSectionSkeleton } from "@/modules/home/ui/components/search-filters/search-section-skeleton";
import { SearchFilters } from "@/modules/home/ui/components/search-filters/search-filters";

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
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Suspense fallback={<SearchSectionSkeleton />}>
            <SearchFilters />
          </Suspense>
        </HydrationBoundary>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
