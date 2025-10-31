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

export const DEFAULT_LIMIT_INFINITE_LOAD = 8;

export const MAX_PRODUCT_RATING = 5;
export const MIN_PRODUCT_RATING = 0;
