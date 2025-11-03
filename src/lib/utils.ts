import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { differenceInDays } from "date-fns";

import { NAVBAR_ITEMS } from "@/modules/products/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isActiveMainNav(href: string, pathname: string) {
  const excluded = NAVBAR_ITEMS.map((item) => item.href).filter(
    (item) => item !== "/"
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
