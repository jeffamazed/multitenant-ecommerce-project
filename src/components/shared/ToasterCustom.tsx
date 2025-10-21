"use client";

import { useIsMobile } from "@/hooks/use-mobile";

import { Toaster } from "../ui/sonner";

export const ToasterCustom = () => {
  const isMobile = useIsMobile();
  return (
    <Toaster
      position={isMobile ? "top-center" : "bottom-right"}
      duration={5000}
      visibleToasts={3}
      expand
      theme="light"
      swipeDirections={["left", "right", "top"]}
    />
  );
};
