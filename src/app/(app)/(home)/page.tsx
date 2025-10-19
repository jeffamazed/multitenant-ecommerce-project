import { getPayload } from "payload";
import configPromise from "@payload-config";
import { Category } from "@/payload-types";

import { SearchFilters } from "./search-filters";

export default async function Home() {
  const payload = await getPayload({
    config: configPromise,
  });

  const data = await payload.find({
    collection: "categories",
    pagination: false,
    depth: 1, // Populate subcategories, subcategories[0] will be type "Category"
    where: {
      parent: {
        exists: false,
      },
    },
  });

  const formattedData = data.docs.map((doc) => ({
    ...doc,
    subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
      // Because of 'depth: 1' "doc" will be type of Category
      ...(doc as Category),
      subcategories: undefined,
    })),
  }));

  return (
    <div className="max-container common-padding">
      <h1 className="text-center text-2xl md:text-3xl mb-6 lg:mb-8">
        One Platform. Every Store. Seamlessly.
      </h1>
      <SearchFilters data={formattedData} />
    </div>
  );
}
