"use client";

import { useEffect } from "react";
import { toast } from "sonner";

import { ErrorPlaceholder } from "@/components/shared/error-placeholder";

const ErrorProductPage = () => {
  useEffect(() => {
    toast.error("Something went wrong!");
  }, []);

  return (
    <ErrorPlaceholder
      Heading="h1"
      headingContent="Something went wrong!"
      content="We're working on it..."
    />
  );
};

export default ErrorProductPage;
