import { isAdminPasswordSecure } from "@/lib/admin-password";

export function register() {
  if (!isAdminPasswordSecure()) {
    console.warn(
      "[Soba House] ADMIN_PASSWORD is unset or still the default 'admin'. " +
        "The /admin area is disabled until a strong ADMIN_PASSWORD is configured."
    );
  }
}
