"use client";

import { Link, useAuth } from "@payloadcms/ui";
import type { User, Tenant } from "@/payload-types";
import { ArrowRight, ShieldCheck } from "lucide-react";

export const StripeVerify = () => {
  const { user } = useAuth<User>();
  const tenant = user?.tenants?.[0]?.tenant as Tenant; // this is the tenant ID

  // hide the button if verified
  if (tenant.stripeDetailsSubmitted) return null;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "fit-content",
        margin: "1rem 0 ",
        padding: "0.75rem 1.5rem",
        backgroundImage: "linear-gradient(90deg, #7C6FFF 0%, #9F7AFE 100%)",
        borderRadius: "0.5rem",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
      }}
    >
      <p>
        Verify your Stripe account here{" "}
        <ArrowRight
          style={{ width: "1.2rem", height: "1.2rem", marginRight: "0.25rem" }}
        />
      </p>
      <Link
        href="/stripe-verify"
        className="btn btn--icon-style-without-border btn--size-medium btn--withoutPopup btn--style-primary btn--withoutPopup"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundImage: "linear-gradient(90deg, #635BFF 0%, #8B5CF6 100%)",
          color: "#fff",
          fontWeight: 500,
          border: "none",
          transition: "opacity 0.2s ease-in-out",
          margin: "0px",
        }}
        onPointerEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
        onPointerLeave={(e) => (e.currentTarget.style.opacity = "1")}
        onFocusCapture={(e) => (e.currentTarget.style.opacity = "0.9")}
        onBlurCapture={(e) => (e.currentTarget.style.opacity = "1")}
        aria-label="Verify Stripe account"
      >
        <ShieldCheck
          style={{ width: "1.2rem", height: "1.2rem", marginRight: "0.25rem" }}
        />
        Verify
      </Link>
    </div>
  );
};
