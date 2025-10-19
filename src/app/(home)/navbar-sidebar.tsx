import { MenuIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { NAVBAR_ITEMS } from "@/lib/constants";
import TooltipCustom from "@/components/shared/TooltipCustom";
import { cn, isActiveDeterminer } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";

export const NavbarSidebar = () => {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState<boolean>(false);
  const isMobile = useIsMobile(1024);
  const pathname = usePathname();

  useEffect(() => {
    if (!isMobile) setOpen(false);
  }, [isMobile]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <TooltipCustom
        trigger={
          <Button
            variant="ghost"
            className="size-12 border-transparent bg-white"
            ref={triggerRef}
            onClick={() => setOpen(true)}
            aria-label="Open Menu"
          >
            <MenuIcon className="size-6" />
          </Button>
        }
        content="Menu"
        sideOffset={8}
      />

      <SheetContent
        side="left"
        className="p-0 transition-none gap-0"
        onCloseAutoFocus={() => {
          triggerRef.current?.focus();
        }}
      >
        <SheetHeader className="p-4 border-b">
          <div className="flex items-center">
            <SheetTitle className="text-xl">Menu</SheetTitle>
          </div>
          <SheetDescription className="sr-only">
            Mobile sidebar
          </SheetDescription>
        </SheetHeader>

        {/* NAV CONTENT */}
        <nav aria-label="Main navigation" className="overflow-y-auto">
          <ScrollArea className="flex flex-col  h-full pb-2">
            {NAVBAR_ITEMS.map(({ href, children }) => {
              const isActive = isActiveDeterminer(href, pathname);
              return (
                <Link
                  href={href}
                  key={href}
                  className={cn("navbar-items-mobile", {
                    "bg-black text-white hover:bg-black hover:text-white":
                      isActive,
                  })}
                  onClick={() => setOpen(false)}
                  aria-current={isActive ? "page" : undefined}
                >
                  {children}
                </Link>
              );
            })}

            <div className="border-t">
              <Link
                href="/sign-in"
                className="navbar-items-mobile"
                onClick={() => setOpen(false)}
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="navbar-items-mobile"
                onClick={() => setOpen(false)}
              >
                Start selling
              </Link>
            </div>
          </ScrollArea>
        </nav>
      </SheetContent>
    </Sheet>
  );
};
