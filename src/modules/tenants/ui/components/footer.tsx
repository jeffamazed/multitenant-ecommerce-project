import Link from "next/link";

import { poppins } from "@/lib/fonts";
import { cn } from "@/lib/utils";

export const Footer = () => {
  return (
    <footer className="flex border-t font-medium bg-white">
      <div className="flex items-center max-container common-padding-x py-4">
        <p>
          Made possible by{" "}
          <Link
            href="/"
            className={cn("text-2xl font-semibold", poppins.className)}
          >
            Monavo
          </Link>
        </p>
      </div>
    </footer>
  );
};
