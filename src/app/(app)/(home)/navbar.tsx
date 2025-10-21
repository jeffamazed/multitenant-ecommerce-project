"use client";

import { Poppins } from "next/font/google";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NAVBAR_ITEMS } from "@/lib/constants";

import { NavbarSidebar } from "./navbar-sidebar";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
});

interface NavbarItemprops {
  href: string;
  children: React.ReactNode;
  isActive?: boolean;
}

const NavbarItem = ({ href, children, isActive }: NavbarItemprops) => {
  return (
    <Button
      asChild
      variant="outline"
      className={cn(
        "bg-transparent hover:bg-transparent rounded-full hover:border-border border-transparent px-3.5 text-lg active",
        {
          "bg-black text-white hover:bg-black hover:text-white": isActive,
        }
      )}
    >
      <Link href={href} aria-current={isActive ? "page" : undefined}>
        {children}
      </Link>
    </Button>
  );
};

export const Navbar = () => {
  const pathname = usePathname();

  return (
    <header className="border-b sticky top-0 bg-white z-50">
      <div className="max-container h-18 flex items-center w-full justify-between gap-6 xl:gap-8 overflow-x-auto">
        {/* MAIN LINK */}
        <Link href="/" className="ml-6 lg:ml-8">
          <span className={cn("text-4xl font-semibold", poppins.className)}>
            Monavo
          </span>
        </Link>
        <nav
          aria-label="Main navigation"
          className="h-full hidden lg:flex items-center gap-6 xl:gap-8 font-medium bg-white w-full justify-between"
        >
          {/* MIDDLE NAV */}
          <div className="items-center gap-2 xl:gap-4 flex">
            {NAVBAR_ITEMS.map(({ href, children }) => (
              <NavbarItem key={href} href={href} isActive={pathname === href}>
                {children}
              </NavbarItem>
            ))}
          </div>

          {/* RIGHT LINKS */}
          <div className="hidden lg:flex h-full">
            <Button
              asChild
              variant="secondary"
              className="border-l border-t-0 border-b-0 border-r-0 px-8 xl:px-12 h-full rounded-none bg-white hover:bg-custom-accent focus-visible:bg-custom-accent transition-colors text-lg"
            >
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button
              asChild
              className="border-l border-t-0 border-b-0 border-r-0 px-8 xl:px-12 h-full rounded-none bg-black text-white hover:bg-custom-accent focus-visible:bg-custom-accent hover:text-black focus-visible:text-black transition-colors text-lg"
            >
              <Link href="/sign-up">Start selling</Link>
            </Button>
          </div>
        </nav>

        {/* FOR MOBILE */}
        <div className="flex lg:hidden items-center justify-center mr-6 ml-auto">
          <NavbarSidebar />
        </div>
      </div>
    </header>
  );
};
