import { Skeleton } from "@/components/ui/skeleton";

export const SearchFiltersSkeleton = () => {
  // Generate deterministic pseudo-random widths (65%, 70%, 75%, 80%, 85%, 90%)
  const widths = Array.from({ length: 5 }, (_, i) => `${65 + i * 5}%`);

  return (
    <div className="w-full overflow-hidden flex justify-between gap-2">
      {widths.map((width, i) => (
        <Skeleton
          key={i}
          className="h-12 rounded-full bg-skeleton"
          style={{ width }}
        />
      ))}
    </div>
  );
};
