"use client";

import { useEffect } from "react";
import { toast } from "sonner";

import { ErrorPlaceholder } from "@/components/shared/error-placeholder";

const NotFound = () => {
  useEffect(() => {
    toast.error("Product is not available.");
  }, []);

  return (
    <ErrorPlaceholder
      Heading="h1"
      headingContent="The product is not available"
      content="It looks like this product doesn't exist or is no longer available."
    />
  );
};

export default NotFound;
