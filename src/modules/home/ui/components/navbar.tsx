"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

import { cn, isActiveMainNav } from "@/lib/utils";
import { poppins } from "@/lib/fonts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import useAuth from "@/hooks/use-auth";

import { NAVBAR_ITEMS } from "../../constants";
import { NavbarSidebar } from "./navbar-sidebar";

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
  const session = useAuth();

  const queryClient = useQueryClient();
  const trpc = useTRPC();
  const { mutate: mutateSignOut, isPending } = useMutation(
    trpc.auth.signOut.mutationOptions({
      onError: (error) => {
        toast.error(error.message);
      },
      onSuccess: () => {
        toast.success("Signed out successfully!");
      },
      onSettled: async () => {
        await queryClient.invalidateQueries(trpc.auth.session.queryFilter());
      },
    })
  );

  const handleSignOut = () => {
    mutateSignOut();
  };
  return (
    <header className="border-b sticky top-0 left-0 bg-white z-50 w-full h-18">
      <div className="common-padding-x max-container size-full flex items-center justify-between gap-6 xl:gap-8 overflow-x-auto">
        {/* MAIN LINK */}
        <Link href="/">
          <span className={cn("text-4xl font-semibold", poppins.className)}>
            Monavo
          </span>
        </Link>
        <nav
          aria-label="Main navigation"
          className="h-full hidden lg:flex items-center gap-6 xl:gap-8 font-medium bg-white w-full justify-between"
        >
          {/* MIDDLE NAV */}
          <ul className="items-center gap-1 xl:gap-4 flex">
            {NAVBAR_ITEMS.map(({ href, children }) => {
              // EXCLUDED HREF
              const isActive = isActiveMainNav(href, pathname);

              return (
                <li key={href}>
                  <NavbarItem href={href} isActive={isActive}>
                    {children}
                  </NavbarItem>
                </li>
              );
            })}
          </ul>
          {session.isPending && (
            <Skeleton className="bg-skeleton h-full max-xl:w-[9.9125rem] w-47.5 rounded-none" />
          )}

          {/* RIGHT LINKS */}
          <ul
            className={cn("h-full hidden lg:flex", {
              "opacity-0 absolute pointer-events-none": session.isPending,
            })}
            inert={session.isPending}
          >
            {session.data?.user ? (
              <>
                <li>
                  <Button
                    asChild
                    className="border-l border-t-0 border-b-0 border-r px-6 xl:px-12 h-full rounded-none bg-black text-white hover:bg-custom-accent focus-visible:bg-custom-accent hover:text-black focus-visible:text-black transition-colors text-lg"
                  >
                    <Link href="/admin" aria-label="Navigate to dashboard">
                      Dashboard
                    </Link>
                  </Button>
                </li>
                <li>
                  <Button
                    className="border-l border-t-0 border-b-0 border-r px-6! xl:px-12! h-full rounded-none bg-white text-black hover:bg-destructive focus-visible:bg-destructive hover:text-red-50 focus-visible:text-red-50 transition-colors text-lg"
                    onClick={handleSignOut}
                    disabled={isPending}
                  >
                    {isPending && <Spinner />}
                    Sign out
                  </Button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Button
                    asChild
                    variant="secondary"
                    className="border-l border-t-0 border-b-0 border-r-0 px-6 xl:px-12 h-full rounded-none bg-white hover:bg-custom-accent focus-visible:bg-custom-accent transition-colors text-lg"
                  >
                    <Link prefetch href="/sign-in">
                      Sign In
                    </Link>
                  </Button>
                </li>
                <li>
                  <Button
                    asChild
                    className="border-l border-t-0 border-b-0 border-r px-8 xl:px-12 h-full rounded-none bg-black text-white hover:bg-custom-accent focus-visible:bg-custom-accent hover:text-black focus-visible:text-black transition-colors text-lg"
                  >
                    <Link
                      prefetch
                      href="/sign-up"
                      aria-label="Sign up and start selling"
                    >
                      Start Selling
                    </Link>
                  </Button>
                </li>
              </>
            )}
          </ul>
        </nav>

        {/* FOR MOBILE */}
        <div className="flex lg:hidden items-center justify-center">
          <NavbarSidebar />
        </div>
      </div>
    </header>
  );
};
