"use server";

import { redirect } from "next/navigation";
import { createSession, destroySession, verifyAdminPassword } from "@/lib/auth";

export async function login(formData: FormData): Promise<void> {
  const password = String(formData.get("password") ?? "");
  if (!verifyAdminPassword(password)) {
    redirect("/admin/login?error=1");
  }
  await createSession();
  redirect("/admin/orders");
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}
