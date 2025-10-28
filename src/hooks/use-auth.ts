import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

const useAuth = () => {
  const trpc = useTRPC();
  return useQuery(trpc.auth.session.queryOptions());
};

export default useAuth;
