"use client";

import { getSession, signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type AuthFormProps = {
  lang: string;
  showGoogle?: boolean;
  showGitHub?: boolean;
};

export default function AuthForm({
  lang,
  showGoogle,
  showGitHub,
}: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") ?? "/app";
  const roleHome: Record<string, string> = {
    SUPERADMIN: "/super-admin",
    ADMIN: "/admin",
    INSTRUCTOR: "/instructor",
    REVIEWER: "/reviewer",
    MODERATOR: "/moderator",
    USER: "/app",
    SUBSCRIBER: "/app",
  };
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Credenciales inválidas.");
      setLoading(false);
      return;
    }

    const session = await getSession();
    const rolePath = session?.user?.role ? roleHome[session.user.role] : "/app";
    const target = nextPath ? nextPath : rolePath;
    router.push(`/${lang}${target}`);
  }

  async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "");
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data?.error ?? "Error al crear la cuenta.");
      setLoading(false);
      return;
    }

    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    const session = await getSession();
    const rolePath = session?.user?.role ? roleHome[session.user.role] : "/app";
    router.push(`/${lang}${rolePath}`);
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2 rounded-full border border-black/10 bg-white p-1 text-xs uppercase tracking-[0.2em]">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`flex-1 rounded-full px-4 py-2 ${
            mode === "login" ? "bg-ink text-white" : "text-zinc-600"
          }`}
        >
          Ingresar
        </button>
        <button
          type="button"
          onClick={() => setMode("register")}
          className={`flex-1 rounded-full px-4 py-2 ${
            mode === "register" ? "bg-ink text-white" : "text-zinc-600"
          }`}
        >
          Crear cuenta
        </button>
      </div>

      {mode === "login" ? (
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-zinc-500">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-zinc-500">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm"
            />
          </div>
          {error ? (
            <p className="text-sm text-ember">{error}</p>
          ) : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-ink px-6 py-3 text-xs uppercase tracking-[0.2em] text-white"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-zinc-500">
              Nombre
            </label>
            <input
              name="name"
              type="text"
              required
              className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-zinc-500">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-zinc-500">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              minLength={8}
              className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm"
            />
          </div>
          {error ? (
            <p className="text-sm text-ember">{error}</p>
          ) : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-ink px-6 py-3 text-xs uppercase tracking-[0.2em] text-white"
          >
            {loading ? "Creando..." : "Crear cuenta"}
          </button>
        </form>
      )}

      {(showGoogle || showGitHub) && (
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
            Social login
          </p>
          <div className="grid gap-2">
            {showGoogle ? (
              <button
                type="button"
                onClick={() => signIn("google")}
                className="rounded-full border border-black/10 px-4 py-2 text-xs uppercase tracking-[0.2em]"
              >
                Google
              </button>
            ) : null}
            {showGitHub ? (
              <button
                type="button"
                onClick={() => signIn("github")}
                className="rounded-full border border-black/10 px-4 py-2 text-xs uppercase tracking-[0.2em]"
              >
                GitHub
              </button>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
