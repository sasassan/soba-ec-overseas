import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { login } from "@/app/admin/actions";

export const metadata = {
  title: "Admin Login",
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await isAuthenticated()) {
    redirect("/admin/orders");
  }
  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4">
      <div className="w-full max-w-sm rounded-lg border border-ink-line bg-ink-card p-8">
        <h1 className="font-serif text-2xl text-cream">Admin Login</h1>
        <p className="mt-2 text-sm text-cream-dim">
          Enter the admin password to continue.
        </p>

        {error && (
          <p className="mt-4 rounded border border-lacquer bg-lacquer/10 px-4 py-2 text-sm text-cream">
            Incorrect password.
          </p>
        )}

        <form action={login} className="mt-6 space-y-4">
          <label className="block text-sm">
            <span className="text-cream-dim">Password</span>
            <input
              type="password"
              name="password"
              autoFocus
              required
              className="mt-1 w-full rounded border border-ink-line bg-ink-soft px-3 py-2 text-cream focus:border-gold-soft focus:outline-none"
            />
          </label>
          <button
            type="submit"
            className="w-full rounded border border-gold bg-gold/10 px-4 py-2.5 text-gold hover:bg-gold/20 transition-colors"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
