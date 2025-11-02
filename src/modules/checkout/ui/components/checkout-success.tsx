import useTimer from "@/hooks/use-timer";
import { TrendingUp } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const CheckoutSuccess = () => {
  const router = useRouter();

  const timer = useTimer({ seconds: 5, fn: () => router.replace("/library") });

  return (
    <div className="text-center">
      <h1 className="text-center">
        Purchase Successful!{" "}
        <TrendingUp className="inline size-10 text-green-700" />
      </h1>
      <p className="mt-4 text-base lg:text-lg">
        {timer === 0
          ? "Redirecting..."
          : `You are going to be redirected to the library in ${timer} seconds...`}
      </p>
      <p className="text-muted-foreground mt-2 text-sm lg:text-base">
        Click{" "}
        <Link
          href="/library"
          aria-label="Navigate to library"
          className="underline text-blue-500 font-bold"
        >
          here
        </Link>{" "}
        if you are not yet redirected.
      </p>
      <span className="sr-only" aria-live="assertive" role="alert">
        {timer === 0 ? "Redirecting to library now" : ""}
      </span>
    </div>
  );
};
