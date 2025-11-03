import { Category } from "@/payload-types";

import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";

export const categoriesRouter = createTRPCRouter({
  getMany: baseProcedure.query(async ({ ctx }) => {
    let data;
    try {
      data = await ctx.db.find({
        collection: "categories",
        pagination: false,
        depth: 1, // Populate subcategories
        where: {
          parent: {
            exists: false,
          },
        },
      });
    } catch (error) {
      console.error(
        `[Categories GetMany] Failed to fetch categories, timestamp: ${new Date().toISOString()}`,
        error
      );
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch categories. Please try again later.",
      });
    }

    const formattedData = data.docs.map((doc) => ({
      ...doc,
      subcategories: (doc.subcategories?.docs ?? []).map((subcat) => ({
        ...(subcat as Category),
      })),
    }));

    // sort categories, putting "Other" last
    formattedData.sort((a, b) => {
      if (a.name === "Other") return 1;
      if (b.name === "Other") return -1;
      return a.name.localeCompare(b.name);
    });

    return formattedData;
  }),
});
