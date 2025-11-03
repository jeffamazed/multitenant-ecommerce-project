// Import global styles and fonts
import type { Metadata } from "next";
import { LucideHouse } from "lucide-react";
import "@/app/(app)/globals.css";
import Link from "next/link";

import { dmSans } from "@/lib/fonts";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description: "The page you are looking for does not exist.",
};

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body className={dmSans.className}>
        <main className="w-full min-h-dvh flex-cent flex-col bg-zinc-100 gap-4 common-padding text-center">
          <h1>404 - Page Not Found</h1>
          <p className="text-medium">
            This page does not exist. Perhaps you might want to go back home?
          </p>
          <Button
            asChild
            variant="elevated"
            className="hover:bg-custom-accent focus-visible:bg-custom-accent"
          >
            <Link href={process.env.NEXT_PUBLIC_APP_URL!}>
              <LucideHouse className="size-5" />
              Home
            </Link>
          </Button>
        </main>
      </body>
    </html>
  );
}
