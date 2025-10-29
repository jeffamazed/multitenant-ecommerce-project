import { Category } from "@/payload-types";

import { baseProcedure, createTRPCRouter } from "@/trpc/init";

export const categoriesRouter = createTRPCRouter({
  getMany: baseProcedure.query(async ({ ctx }) => {
    const data = await ctx.db.find({
      collection: "categories",
      pagination: false,
      depth: 1, // Populate subcategories, subcategories[0] will be type "Category"
      where: {
        parent: {
          exists: false,
        },
      },
      sort: "name",
    });

    const formattedData = data.docs.map((doc) => ({
      ...doc,
      subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
        // Because of 'depth: 1' "doc" will be type of Category
        ...(doc as Category),
      })),
    }));

    return formattedData;
  }),
});
