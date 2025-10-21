import { inferRouterOutputs } from "@trpc/server";

import { type AppRouter } from "@/trpc/routers/_app";

// INFERING THE TYPE BASED ON THE OUTPUT
export type CategoriesGetManyOutput =
  inferRouterOutputs<AppRouter>["categories"]["getMany"];
