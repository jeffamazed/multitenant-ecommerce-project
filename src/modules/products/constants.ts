import { ArrowDownAZ, ArrowUpAz, LucideIcon } from "lucide-react";
import { sortValues } from "./search-params";

export type SortValue = (typeof sortValues)[number];

export const SORT_BUTTONS: {
  label?: string;
  value: SortValue;
  Icon?: LucideIcon;
  ariaLabel?: string;
  tooltip?: boolean;
}[] = [
  {
    label: "Curated",
    value: "curated",
  },
  {
    label: "Hot & New",
    value: "hot_and_new",
  },
  {
    value: "ascending",
    Icon: ArrowDownAZ,
    ariaLabel: "Sort ascending",
    tooltip: true,
  },
  {
    value: "descending",
    Icon: ArrowUpAz,
    ariaLabel: "Sort descending",
    tooltip: true,
  },
];
