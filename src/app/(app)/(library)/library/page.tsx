import { Metadata } from "next";

import { LibraryView } from "@/modules/library/ui/views/library-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { DEFAULT_LIMIT_INFINITE_LOAD } from "@/lib/constants";

export async function generateMetadata(): Promise<Metadata> {
  const queryClient = getQueryClient();

  const authData = await queryClient.fetchQuery(
    trpc.auth.session.queryOptions()
  );
  const username = authData.user?.username;

  return {
    title: `Library | ${username}`,
    description: `${username}'s library page: browse products, check details, and explore their curated collection.`,
  };
}

export const dynamic = "force-dynamic";

const LibraryPage = () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchInfiniteQuery(
    trpc.library.getMany.infiniteQueryOptions({
      limit: DEFAULT_LIMIT_INFINITE_LOAD,
    })
  );
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <LibraryView />
    </HydrationBoundary>
  );
};

export default LibraryPage;
