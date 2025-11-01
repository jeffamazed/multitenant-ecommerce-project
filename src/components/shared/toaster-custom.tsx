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
      toastOptions={{
        classNames: {
          closeButton: "border-inherit! bg-inherit! text-inherit!",
          toast: "rounded-md!",
          info: "bg-sky-100! border-sky-400! text-sky-900!",
          success: "bg-green-100! border-green-400! text-green-900!",
          warning: "bg-yellow-100! border-yellow-400! text-yellow-900!",
          error: "bg-red-100! border-red-400! text-red-900!",
        },
      }}
      closeButton
    />
  );
};
