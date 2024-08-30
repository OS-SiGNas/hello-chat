export const rolesArray = ["admin", "standard", "moderator", "tester"] as const;

export const roles: Record<string, Roles> = {
  ADMIN: "admin",
  STANDARD: "standard",
  MODERATOR: "moderator",
  TERSTER: "tester",
} as const;

export type Roles = (typeof rolesArray)[number];
