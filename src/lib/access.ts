import { ClientUser } from "payload";
import { User } from "@/payload-types";

export const isSuperAdmin = (user: User | ClientUser | null): boolean => {
  if (!user || !("roles" in user)) return false;
  const roles = (user as User).roles ?? [];
  return roles.includes("super-admin");
};
