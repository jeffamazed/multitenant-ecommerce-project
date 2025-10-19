import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export  const isActiveDeterminer = (href: string, pathname: string): boolean => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };