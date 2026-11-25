import "server-only";

const DEFAULT_PASSWORD = "admin";

/**
 * Returns the configured admin password, trimmed, or undefined when unset or
 * blank.
 */
export function getConfiguredAdminPassword(): string | undefined {
  const value = process.env.ADMIN_PASSWORD;
  if (value === undefined) return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

/**
 * True only when a non-default admin password is configured. The admin area is
 * disabled (and a startup warning is emitted) when this returns false.
 */
export function isAdminPasswordSecure(): boolean {
  const password = getConfiguredAdminPassword();
  if (!password) return false;
  if (password.toLowerCase() === DEFAULT_PASSWORD) return false;
  return true;
}
