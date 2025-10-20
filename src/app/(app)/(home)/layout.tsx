import { getPayload } from "payload";
import { Footer } from "./footer";
import { Navbar } from "./navbar";
import { CustomCategory } from "./types";

import { SearchFilters } from "./search-filters/search-filters";

import configPromise from "@payload-config";
import { Category } from "@/payload-types";

interface Props {
  children: React.ReactNode;
}

const Layout = async ({ children }: Props) => {
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
    sort: "name",
  });

  const formattedData: CustomCategory[] = data.docs.map((doc) => ({
    ...doc,
    subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
      // Because of 'depth: 1' "doc" will be type of Category
      ...(doc as Category),
      subcategories: undefined,
    })),
  }));

  return (
    <div className="flex flex-col min-h-dvh overflow-x-hidden">
      <Navbar />

      <main className="flex-1 bg-zinc-100">
        <section className="bg-custom-accent-secondary flex-cent">
          <div className="max-container common-padding">
            <h1 className="text-center text-2xl md:text-3xl mb-6 lg:mb-8 font-semibold">
              One Platform. Every Store. Seamlessly.
            </h1>
            <SearchFilters data={formattedData} />
          </div>
        </section>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
