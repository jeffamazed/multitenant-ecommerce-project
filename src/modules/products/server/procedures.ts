import z from "zod";
import { headers as getHeaders } from "next/headers";
import { Sort, Where } from "payload";

import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { Category, Media, Tenant } from "@/payload-types";
import { DEFAULT_LIMIT_INFINITE_LOAD } from "@/lib/constants";

import { sortValues } from "../search-params";
import { TRPCError } from "@trpc/server";

export const productsRouter = createTRPCRouter({
  getMeta: baseProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const product = await ctx.db.findByID({
        collection: "products",
        id: input.id,
        select: {
          name: true,
        },
      });

      if (!product) {
        console.error(
          `[Products GetMeta] Product not found - id: ${input.id}, timestamp: ${new Date().toISOString()}`
        );
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found.",
        });
      }

      return product;
    }),

  getOne: baseProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const headers = await getHeaders();
      const session = await ctx.db.auth({ headers });

      let product;
      try {
        product = await ctx.db.findByID({
          collection: "products",
          id: input.id,
          depth: 2, // Load the "product.image", "product.tenant", and "product.tenant.image"
          select: {
            content: false,
          },
        });
      } catch (error) {
        console.error(
          `[Products GetOne] Failed to fetch product - id: ${input.id}, error:`,
          error,
          `timestamp: ${new Date().toISOString()}`
        );
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found.",
        });
      }

      if (!product || product.isArchived) {
        console.error(
          `[Products GetOne] Product not found or archived - id: ${input.id}, timestamp: ${new Date().toISOString()}`
        );
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found.",
        });
      }

      let isPurchased: boolean = false;

      if (session.user) {
        const ordersData = await ctx.db.find({
          collection: "orders",
          pagination: false,
          limit: 1,
          where: {
            and: [
              {
                product: {
                  equals: input.id,
                },
                user: {
                  equals: session.user.id,
                },
              },
            ],
          },
        });

        isPurchased = !!ordersData.docs[0];
      }

      const reviewsData = await ctx.db.find({
        collection: "reviews",
        pagination: false,
        where: {
          product: {
            equals: input.id,
          },
        },
      });

      const reviewCount = reviewsData.totalDocs || 0;
      const reviewRating =
        reviewCount > 0
          ? reviewsData.docs.reduce((acc, review) => acc + review.rating, 0) /
            reviewCount
          : 0;

      const ratingDistribution: Record<number, number> = {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
      };

      if (reviewCount > 0) {
        reviewsData.docs.forEach((r) => {
          const rating = r.rating;

          if (rating >= 1 && rating <= 5) {
            ratingDistribution[rating] = (ratingDistribution[rating] || 0) + 1;
          }
        });

        Object.keys(ratingDistribution).forEach((key) => {
          const rating = Number(key);
          const count = ratingDistribution[rating] || 0;
          ratingDistribution[rating] = Math.round((count / reviewCount) * 100);
        });
      }

      return {
        ...product,
        isPurchased,
        image: product.image as Media | null,
        cover: product.cover as Media | null,
        tenant: product.tenant as Tenant & { image: Media | null },
        reviewRating,
        reviewCount,
        ratingDistribution,
      };
    }),

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
        search: z.string().nullable().optional(),
        tenantSlug: z.string().nullable().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const where: Where = {
        isArchived: {
          not_equals: true,
        },
      };
      let sort: Sort = "-createdAt";

      // TODO: SORTING EDIT LATER
      if (input.sort === "curated") sort = "-score";
      if (input.sort === "hot_and_new") sort = "-createdAt";
      if (input.sort === "ascending") sort = "name";
      if (input.sort === "descending") sort = "-name";

      if (input.minPrice || input.maxPrice) {
        where.price = {};

        // GUARD AGAINST INVALID INPUTS
        const min = parseFloat(input.minPrice ?? "");
        if (!isNaN(min)) where.price.greater_than_equal = min;

        const max = parseFloat(input.maxPrice ?? "");
        if (!isNaN(max)) where.price.less_than_equal = max;
      }

      // TENANT SPECIFIC
      if (input.tenantSlug) {
        where["tenant.slug"] = {
          equals: input.tenantSlug,
        };
      } else {
        // MAKING SURE PRIVATE PRODUCTS ARE NOT SHOWN ON PUBLIC STOREFRONT
        // THESE PRODUCTS ARE EXCLUSIVELY PRIVATE TO THE TENANT STORE
        where["isPrivate"] = {
          not_equals: true,
        };
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

      // SEARCH
      if (input.search) {
        where["name"] = {
          like: input.search,
        };
      }

      const data = await ctx.db.find({
        collection: "products",
        depth: 2, // Populate "category","image", "tenant", "tenant.image"
        where,
        sort,
        page: input.cursor,
        limit: input.limit,
        select: {
          content: false,
        },
      });

      const productIds = data.docs.map((p) => p.id);
      const allReviews = await ctx.db.find({
        collection: "reviews",
        pagination: false,
        depth: 0,
        where: {
          product: { in: productIds },
        },
      });

      // group reviews by product id
      const reviewsByProduct = allReviews.docs.reduce(
        (acc, review) => {
          const productId = review.product as string;
          if (!acc[productId]) acc[productId] = [];
          acc[productId].push(review);

          return acc;
        },
        {} as Record<string, typeof allReviews.docs>
      );

      const docsWithReviews = data.docs.map((doc) => {
        const reviews = reviewsByProduct[doc.id] || [];
        const reviewCount = reviews.length;
        const reviewRating =
          reviewCount > 0
            ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount
            : 0;

        return { ...doc, reviewCount, reviewRating };
      });

      return {
        ...data,
        docs: docsWithReviews.map((doc) => ({
          ...doc,
          image: doc.image as Media | null,
          tenant: doc.tenant as Tenant & { image: Media | null },
        })),
      };
    }),
});
