import { TrendingUp } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export const CheckoutSuccess = () => {
  const router = useRouter();
  const [timer, setTimer] = useState<number>(5);
  const timerId = useRef<null | NodeJS.Timeout>(null);

  useEffect(() => {
    const future = Date.now() + 5000;

    timerId.current = setInterval(() => {
      const now = Date.now();
      const diff = future - now;
      const secondsLeft = Math.max(Math.ceil(diff / 1000), 0);
      setTimer(secondsLeft);

      if (secondsLeft <= 0) {
        clearInterval(timerId.current!);
        router.push("/library");
      }
    }, 1000);

    return () => {
      if (timerId.current) clearInterval(timerId.current);
    };
  }, [router]);

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
