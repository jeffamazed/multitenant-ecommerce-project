import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { NAVBAR_ITEMS } from "./constants";

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
  return `/tenants/${tenantSlug}`;
}

export function formatCurrency(value: number | string | undefined) {
  if (!value) return;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value));
}
