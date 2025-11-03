"use client";

import { Link } from "@payloadcms/ui";
import { LucideHome } from "lucide-react";

export const BackToHome = () => {
  return (
    <Link
      href={process.env.NEXT_PUBLIC_APP_URL!}
      className="btn btn--icon-style-without-border btn--size-medium btn--withoutPopup btn--style-primary btn--withoutPopup"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      aria-label="Back to homepage"
    >
      <LucideHome
        style={{ width: "1.2rem", height: "1.2rem", marginRight: "0.25rem" }}
      />
      Home
    </Link>
  );
};
