import z from "zod";

import { Sort, Where } from "payload";

import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { Category, Media } from "@/payload-types";
import { DEFAULT_LIMIT_INFINITE_LOAD } from "@/lib/constants";

import { sortValues } from "../search-params";

export const productsRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        cursor: z.number().default(1),
        limit: z.number().default(DEFAULT_LIMIT_INFINITE_LOAD),
        category: z.string().nullable().optional(),
        minPrice: z.string().nullable().optional(),
        maxPrice: z.string().nullable().optional(),
        tags: z.array(z.string()).nullable().optional(),
        sort: z.enum(sortValues).nullable().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const where: Where = {};
      let sort: Sort = "-createdAt";

      // TODO: SORTING EDIT LATER
      if (input.category !== "favicon.ico" && input.sort === "curated") {
        sort = "name";
      }
      if (input.category !== "favicon.ico" && input.sort === "trending") {
        sort = "-name";
      }
      if (input.category !== "favicon.ico" && input.sort === "hot_and_new") {
        sort = "-createdAt";
      }

      if (input.minPrice || input.maxPrice) {
        where.price = {};

        // GUARD AGAINST INVALID INPUTS
        const min = parseFloat(input.minPrice ?? "");
        if (!isNaN(min)) where.price.greater_than_equal = min;

        const max = parseFloat(input.maxPrice ?? "");
        if (!isNaN(max)) where.price.less_than_equal = max;
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

      // TAGS CONDITION
      if (input.tags && input.tags.length > 0) {
        where["tags.name"] = {
          in: input.tags,
        };
      }

      const data = await ctx.db.find({
        collection: "products",
        depth: 1, // Populate "category" and "image",
        where,
        sort,
        page: input.cursor,
        limit: input.limit,
      });

      return {
        ...data,
        docs: data.docs.map((doc) => ({
          ...doc,
          image: doc.image as Media | null,
        })),
      };
    }),
});
