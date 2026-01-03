"use client";

import { getSession, signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useId, useState } from "react";
import { DEFAULT_LOCALE, isLocale, type AppLocale } from "@/lib/i18n";
import esAr from "@/lib/dictionaries/es-ar.json";
import esMx from "@/lib/dictionaries/es-mx.json";
import en from "@/lib/dictionaries/en.json";

const dictionaries: Record<AppLocale, typeof esAr> = {
  "es-ar": esAr,
  "es-mx": esMx,
  en,
};

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
  const nextPath = searchParams.get("next");
  const dictionary = dictionaries[isLocale(lang) ? lang : DEFAULT_LOCALE];
  const auth = dictionary.auth;
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
  const panelId = useId();
  const loginPanelId = `${panelId}-login`;
  const registerPanelId = `${panelId}-register`;
  const isLogin = mode === "login";

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
      setError(auth.errors.invalidCredentials);
      setLoading(false);
      return;
    }

    const session = await getSession();
    const rolePath = session?.user?.role ? roleHome[session.user.role] : "/app";
    const target = nextPath ?? rolePath;
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
      setError(data?.error ?? auth.errors.register);
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
      <div
        className="flex gap-2 rounded-full border border-black/10 bg-white p-1 text-xs uppercase tracking-[0.2em]"
        role="group"
        aria-label="Selector de acceso"
      >
        <button
          type="button"
          onClick={() => setMode("login")}
          aria-expanded={isLogin}
          aria-controls={loginPanelId}
          className={`flex-1 rounded-full px-4 py-2 ${
            mode === "login" ? "bg-ink text-white" : "text-zinc-600"
          }`}
        >
          {auth.tabs.login}
        </button>
        <button
          type="button"
          onClick={() => setMode("register")}
          aria-expanded={!isLogin}
          aria-controls={registerPanelId}
          className={`flex-1 rounded-full px-4 py-2 ${
            mode === "register" ? "bg-ink text-white" : "text-zinc-600"
          }`}
        >
          {auth.tabs.register}
        </button>
      </div>

      <form
        id={loginPanelId}
        onSubmit={handleLogin}
        className="space-y-4"
        hidden={!isLogin}
        aria-hidden={!isLogin}
      >
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-zinc-500">
              {auth.labels.email}
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
              {auth.labels.password}
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
            {loading ? auth.buttons.loginLoading : auth.buttons.login}
          </button>
      </form>
      <form
        id={registerPanelId}
        onSubmit={handleRegister}
        className="space-y-4"
        hidden={isLogin}
        aria-hidden={isLogin}
      >
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-zinc-500">
              {auth.labels.name}
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
              {auth.labels.email}
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
              {auth.labels.password}
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
            {loading ? auth.buttons.registerLoading : auth.buttons.register}
          </button>
      </form>

      {(showGoogle || showGitHub) && (
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
            {auth.social.title}
          </p>
          <div className="grid gap-2">
            {showGoogle ? (
              <button
                type="button"
                onClick={() => signIn("google")}
                className="rounded-full border border-black/10 px-4 py-2 text-xs uppercase tracking-[0.2em]"
              >
                {auth.social.google}
              </button>
            ) : null}
            {showGitHub ? (
              <button
                type="button"
                onClick={() => signIn("github")}
                className="rounded-full border border-black/10 px-4 py-2 text-xs uppercase tracking-[0.2em]"
              >
                {auth.social.github}
              </button>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

