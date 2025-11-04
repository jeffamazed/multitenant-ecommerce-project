export const DEFAULT_BG_COLOR = "oklch(0.98 0.01 237)";

export interface NavbarItemType {
  href: string;
  children: React.ReactNode;
}

export const NAVBAR_ITEMS: NavbarItemType[] = [
  { href: "/", children: "Home" },
  { href: "/about", children: "About" },
  { href: "/contact", children: "Contact" },
];
