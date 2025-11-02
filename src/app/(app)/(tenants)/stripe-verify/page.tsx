"use client";

import { useEffect } from "react";

import { Spinner } from "@/components/ui/spinner";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";

const StripeVerificationPage = () => {
  const trpc = useTRPC();
  const { mutate: verify } = useMutation(
    trpc.checkout.verify.mutationOptions({
      onSuccess: (data) => {
        window.location.replace(data.url);
      },
      onError: () => {
        window.location.replace("/");
      },
    })
  );

  useEffect(() => {
    verify();
  }, [verify]);

  return (
    <main
      className="bg-zinc-100 min-h-dvh flex-cent flex-col gap-4"
      aria-live="assertive"
      aria-atomic="true"
    >
      <h1 className="pointer-events-none select-none">
        Setting up your Stripe connection...
      </h1>
      <Spinner className="size-10 text-muted-foreground" />
    </main>
  );
};

export default StripeVerificationPage;
