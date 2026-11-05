"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

/** false during SSR/hydration, true on the client — without an effect or setState. */
const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * Floating light/dark switch, pinned to the bottom-left corner.
 * `mounted` guards the resolved theme so SSR and the first client render match.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot
  );

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="fixed bottom-5 left-5 z-50 inline-flex items-center gap-2 rounded-full border border-border bg-card/95 px-3.5 py-2 text-sm font-medium text-foreground shadow-lg backdrop-blur transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
    >
      {isDark ? (
        <Moon aria-hidden className="size-4" />
      ) : (
        <Sun aria-hidden className="size-4" />
      )}
      <span aria-hidden className="hidden sm:inline">
        {isDark ? "Dark" : "Light"}
      </span>
    </button>
  );
}
