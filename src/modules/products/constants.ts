import { ArrowDownAZ, ArrowUpAz, LucideIcon } from "lucide-react";
import { sortValues } from "./search-params";

export interface NavbarItemType {
  href: string;
  children: React.ReactNode;
}

export const NAVBAR_ITEMS: NavbarItemType[] = [
  { href: "/", children: "Home" },
  { href: "/about", children: "About" },
  { href: "/features", children: "Features" },
  { href: "/pricing", children: "Pricing" },
  { href: "/contact", children: "Contact" },
];

export type SortValue = (typeof sortValues)[number];

export const SORT_BUTTONS: {
  label?: string;
  value: SortValue;
  Icon?: LucideIcon;
  ariaLabel?: string;
  tooltip?: boolean;
}[] = [
  {
    label: "Curated",
    value: "curated",
  },
  {
    label: "Hot & New",
    value: "hot_and_new",
  },
  {
    value: "ascending",
    Icon: ArrowDownAZ,
    ariaLabel: "Sort ascending",
    tooltip: true,
  },
  {
    value: "descending",
    Icon: ArrowUpAz,
    ariaLabel: "Sort descending",
    tooltip: true,
  },
];
