"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import type { Role } from "@prisma/client";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { MouseEvent } from "react";
import RoleSwitcher from "@/components/dashboard/RoleSwitcher";
import { ACTIVE_ROLE_COOKIE, parseActiveRole } from "@/lib/auth/activeRole";
import type { AppDictionary, AppLocale } from "@/lib/i18n";
import type {
  SearchCategory,
  UniversalSearchResult,
} from "@/types/search";

type UniversalSearchProps = {
  dictionary: AppDictionary;
  lang: AppLocale;
};

const HOTKEY = "k";

const TYPE_LABELS: Record<
  SearchCategory,
  keyof AppDictionary["dashboard"]
> = {
  resources: "searchTypeResources",
  users: "searchTypeUsers",
  pages: "searchTypePages",
};

function getCookieValue(name: string) {
  if (typeof document === "undefined") {
    return undefined;
  }
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

export function UniversalSearch({ dictionary, lang }: UniversalSearchProps) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UniversalSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeRole, setActiveRole] = useState<Role | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!session?.user?.role) return;
    const parsedRole = parseActiveRole(getCookieValue(ACTIVE_ROLE_COOKIE));
    setActiveRole(parsedRole ?? session.user.role);
  }, [session?.user?.role]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isModifier = event.metaKey || event.ctrlKey;
      if (event.key.toLowerCase() === HOTKEY && isModifier) {
        event.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (event.key === "Escape" && isOpen) {
        event.preventDefault();
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setResults([]);
      setLoading(false);
      setError(null);
      return;
    }
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(query)}&lang=${lang}`,
          {
            signal: controller.signal,
            cache: "no-store",
          }
        );
        const payload = await response.json();
        if (!response.ok) {
          setError(
            payload?.error ?? dictionary.dashboard.searchError ?? "Search failed"
          );
          setResults([]);
          return;
        }
        setResults(payload?.results ?? []);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setError(dictionary.dashboard.searchError ?? "Search failed");
          setResults([]);
        }
      } finally {
        setLoading(false);
      }
    }, 220);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query, dictionary.dashboard.searchError, isOpen, lang]);

  const groupedResults = useMemo(() => results, [results]);

  const handleBackdropClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (event.target === overlayRef.current) {
        setIsOpen(false);
      }
    },
    []
  );

  const hasSession = Boolean(session?.user);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label={dictionary.dashboard.searchHelp}
        className="fixed bottom-6 right-6 z-[900] hidden items-center gap-2 rounded-full border border-black/10 bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-ink shadow-lg backdrop-blur-md md:flex"
      >
        <span className="text-[10px] tracking-[0.2em] text-zinc-500">
          Cmd/Ctrl K
        </span>
        <span className="text-[10px] tracking-[0.2em] text-zinc-500">
          {dictionary.dashboard.searchHelp}
        </span>
      </button>

      {isOpen && (
        <div
          ref={overlayRef}
          onClick={handleBackdropClick}
          className="fixed inset-0 z-[950] flex items-center justify-center bg-black/30 px-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative mx-auto w-full max-w-4xl rounded-3xl border border-black/10 bg-white p-6 shadow-xl shadow-black/10">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                  {dictionary.dashboard.searchHelp}
                </p>
                <h2 className="text-lg font-semibold text-ink">
                  {dictionary.dashboard.searchPlaceholder}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label={dictionary.dashboard.searchHelp}
                className="rounded-full border border-black/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-zinc-500 hover:bg-black/5"
              >
                Esc
              </button>
            </div>

            <div className="mt-4">
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-ink outline-none focus:border-ink focus:ring-2 focus:ring-ink/20"
                placeholder={dictionary.dashboard.searchPlaceholder}
              />
              <p className="mt-1 text-[10px] uppercase tracking-[0.4em] text-zinc-500">
                {dictionary.dashboard.searchHelp}
              </p>
            </div>

            <div className="mt-6">
              {error && (
                <p className="rounded-2xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                  {error}
                </p>
              )}
              {loading && (
                <p className="text-sm text-zinc-500">
                  {dictionary.dashboard.searchLoading ?? "Searching..."}
                </p>
              )}
              {!loading && query && results.length === 0 && !error && (
                <p className="text-sm text-zinc-500">
                  {dictionary.dashboard.searchNoResults ?? "No matches yet."}
                </p>
              )}
              {!query && (
                <p className="text-sm text-zinc-500">
                  {dictionary.dashboard.searchHelp}
                </p>
              )}

              {groupedResults.length > 0 && (
                <ul className="mt-4 max-h-80 space-y-3 overflow-y-auto">
                  {groupedResults.map((result) => (
                    <li key={result.id}>
                      {result.external ? (
                        <a
                          href={result.href}
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => setIsOpen(false)}
                          className="group block rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-ink hover:border-ink/40"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-semibold">{result.label}</p>
                            <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-400">
                              {dictionary.dashboard[TYPE_LABELS[result.type]]}
                            </span>
                          </div>
                          {result.description && (
                            <p className="mt-1 text-xs text-zinc-500">
                              {result.description}
                            </p>
                          )}
                        </a>
                      ) : (
                        <Link
                          href={result.href}
                          onClick={() => setIsOpen(false)}
                          className="group block rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-ink hover:border-ink/40"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-semibold">{result.label}</p>
                            <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-400">
                              {dictionary.dashboard[TYPE_LABELS[result.type]]}
                            </span>
                          </div>
                          {result.description && (
                            <p className="mt-1 text-xs text-zinc-500">
                              {result.description}
                            </p>
                          )}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {hasSession && (
              <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">
                  {dictionary.dashboard.searchSwitchRole}
                </p>
                <RoleSwitcher
                  roles={session.user.roles ?? [session.user.role]}
                  activeRole={activeRole ?? session.user.role}
                  lang={lang}
                  title={dictionary.dashboard.searchSwitchRole}
                />
                <p className="mt-2 text-[10px] text-zinc-500">
                  {dictionary.dashboard.searchSwitchRoleHint}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
