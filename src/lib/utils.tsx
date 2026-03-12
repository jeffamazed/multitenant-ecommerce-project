import { clsx, type ClassValue } from "clsx";
import { differenceInDays } from "date-fns";
import { twMerge } from "tailwind-merge";

import { NAVBAR_ITEMS } from "@/modules/home/constants";
import { DefaultNodeTypes } from "@payloadcms/richtext-lexical";
import { JSXConvertersFunction } from "@payloadcms/richtext-lexical/react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isActiveMainNav(href: string, pathname: string) {
  const excluded = NAVBAR_ITEMS.map((item) => item.href).filter(
    (item) => item !== "/",
  );

  let isActive: boolean;
  // HOME ACTIVE ONLY IF PATHNAME IS NOT IN EXCLUDED
  if (href === "/")
    isActive = !excluded.some((path) => pathname.startsWith(path));
  else isActive = pathname === href || pathname.startsWith(href);

  return isActive;
}

export function headingCategoryFormat(cat: string) {
  return cat
    .split("-")
    .map((w) => w.slice(0, 1).toUpperCase() + w.slice(1))
    .join(" ");
}

export function generateTenantURL(tenantSlug: string) {
  const isDev = process.env.NODE_ENV === "development";
  const isSubdomainRoutingEnabled =
    process.env.NEXT_PUBLIC_ENABLE_SUBDOMAIN_ROUTING! === "true";
  // in dev mode or subdomain routing disabled mode, use normal routing
  if (isDev || !isSubdomainRoutingEnabled) {
    return `${process.env.NEXT_PUBLIC_APP_URL}/tenants/${tenantSlug}`;
  }
  const PROTOCOL = "https";
  const domain = process.env.NEXT_PUBLIC_ROOT_DOMAIN!;

  // in prod, use subdomain routing
  return `${PROTOCOL}://${tenantSlug}.${domain}`;
}

export function formatCurrency(value: number | string | undefined) {
  if (value === undefined) return;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value));
}

export function determineIsProductNew(createdAt: string, daysAgo: number) {
  if (daysAgo < 0) throw new Error("daysAgo must be a non-negative integer.");
  const now = new Date();
  return differenceInDays(now, new Date(createdAt)) <= daysAgo;
}

export const jsxConverters: JSXConvertersFunction<DefaultNodeTypes> = ({
  defaultConverters,
}) => ({
  ...defaultConverters,

  heading: ({ node, nodesToJSX }) => {
    const Tag = node.tag;

    const classes = {
      h1: "text-xl md:text-3xl font-bold mt-8 mb-4",
      h2: "text-lg md:text-2xl font-semibold mt-7 mb-3",
      h3: "text-base md:text-xl font-semibold mt-6 mb-2",
      h4: "text-sm md:text-lg font-medium mt-5 mb-2",
      h5: "text-sm md:text-md font-medium mt-4 mb-1",
      h6: "text-xs md:text-sm font-medium mt-4 mb-1",
    };

    return (
      <Tag className={classes[Tag] || ""}>
        {nodesToJSX({ nodes: node.children })}
      </Tag>
    );
  },

  list: ({ node, nodesToJSX }) => {
    const Tag = node.tag;
    const listClass =
      Tag === "ul" ? "list-disc ml-6 my-4" : "list-decimal ml-6 my-4";
    return (
      <Tag className={listClass}>{nodesToJSX({ nodes: node.children })}</Tag>
    );
  },

  listitem: ({ node, nodesToJSX }) => (
    <li className="mb-2 pl-1 text-sm md:text-base">
      {nodesToJSX({ nodes: node.children })}
    </li>
  ),
});
