import { sortValues } from "./search-params";

export type SortValue = (typeof sortValues)[number];

export const SORT_BUTTONS: { label: string; value: SortValue }[] = [
  {
    label: "Curated",
    value: "curated",
  },
  {
    label: "Trending",
    value: "trending",
  },
  {
    label: "Hot & New",
    value: "hot_and_new",
  },
];
