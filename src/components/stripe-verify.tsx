"use client";

import { Link } from "@payloadcms/ui";

export const StripeVerify = () => {
  return (
    <Link
      href="/stripe-verify"
      className="btn btn--icon-style-without-border btn--size-medium btn--withoutPopup btn--style-primary btn--withoutPopup"
    >
      Verify account
    </Link>
  );
};
