import { useEffect, useRef, useState } from "react";

const useTimer = ({ seconds, fn }: { seconds: number; fn?: () => void }) => {
  const [timer, setTimer] = useState<number>(() => seconds);
  const timerId = useRef<null | NodeJS.Timeout>(null);

  // ensure that fn is stable
  const fnRef = useRef(fn);
  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  useEffect(() => {
    const future = Date.now() + seconds * 1000;

    timerId.current = setInterval(() => {
      const now = Date.now();
      const diff = future - now;
      const secondsLeft = Math.max(Math.ceil(diff / 1000), 0);
      setTimer(secondsLeft);

      if (secondsLeft <= 0) {
        clearInterval(timerId.current!);
        fnRef.current?.();
      }
    }, 1000);

    return () => {
      if (timerId.current) clearInterval(timerId.current);
    };
  }, [seconds]);

  return timer;
};

export default useTimer;
