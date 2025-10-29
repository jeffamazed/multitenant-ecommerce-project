import z from "zod";

import { Where } from "payload";

import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { Category } from "@/payload-types";

export const productsRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        category: z.string().nullable().optional(),
        minPrice: z.string().nullable().optional(),
        maxPrice: z.string().nullable().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const where: Where = {};

      if (input.minPrice || input.maxPrice) {
        where.price = {};

        if (input.minPrice) {
          where.price.greater_than_equal = input.minPrice;
        }

        if (input.maxPrice) {
          where.price.less_than_equal = input.maxPrice;
        }
      }

      if (input.category) {
        const categoriesData = await ctx.db.find({
          collection: "categories",
          limit: 1,
          depth: 1, // Populate subcategories, subcategories[0] will be type "Category"
          pagination: false,
          where: {
            slug: {
              equals: input.category,
            },
          },
        });

        const formattedData = categoriesData.docs.map((doc) => ({
          ...doc,
          subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
            // Because of 'depth: 1' "doc" will be type of Category
            ...(doc as Category),
            subcategories: undefined,
          })),
        }));

        const subcategoriesSlugs = [];
        const parentCategory = formattedData[0];

        // THIS PUSHES ALL AVAILABLE SLUGS EITHER IF IT'S PARENT OR SUBCAT
        if (parentCategory) {
          subcategoriesSlugs.push(
            ...parentCategory.subcategories.map((subcat) => subcat.slug)
          );
          // THIS BUILDS THE WHERE COND FOR ALL THE SLUGS THAT WE WANT TO SHOW
          where["category.slug"] = {
            in: [parentCategory.slug, ...subcategoriesSlugs],
          };
        }
      }

      const data = await ctx.db.find({
        collection: "products",
        depth: 1, // Populate "category" and "image",
        where,
      });

      return data;
    }),
});
