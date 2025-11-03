import { LibraryView } from "@/modules/library/ui/views/library-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { DEFAULT_LIMIT_INFINITE_LOAD } from "@/lib/constants";

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
