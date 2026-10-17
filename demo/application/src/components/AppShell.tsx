"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { formatDayTime } from "@/domain/time";
import { ActingAsProvider, useActingAs, useApi, useDemoState } from "@/state/store";
import { Button, cx, inputClass } from "./ui";
import { SITE } from "@/lib/links";

const NAV = [
  { href: "/", label: "Overview" },
  { href: "/shipments/", label: "Shipments" },
  { href: "/exceptions/", label: "Exceptions" },
  { href: "/track/", label: "Customer view" },
  { href: "/analysis/", label: "BA workspace" },
  { href: "/delivery/", label: "Delivery workspace" },
];

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <ActingAsProvider>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-surface focus:px-3 focus:py-2">
        Skip to content
      </a>
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
          <Link href="/" className="font-semibold tracking-tight">
            Logistics Control Tower
            <span className="ml-2 rounded bg-accent-soft px-1.5 py-0.5 text-xs font-medium text-accent">demo · fictional data</span>
          </Link>
          <Nav />
        </div>
        <DemoControls />
      </header>
      <main id="main" className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
        {children}
      </main>
      <footer className="border-t border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-4 text-xs text-muted">
          Independent portfolio case — Tidewell Logistics is fictional. No real company data, no real customers. The demo runs entirely in your browser on a mock
          API. <a className="text-accent underline" href={SITE}>Back to the case</a>
        </div>
      </footer>
    </ActingAsProvider>
  );
}

function Nav() {
  const pathname = usePathname();
  const norm = (p: string) => (p.endsWith("/") ? p : `${p}/`);
  return (
    <nav aria-label="Main" className="-mx-1 flex flex-wrap gap-1">
      {NAV.map((n) => {
        const current = n.href === "/" ? pathname === "/" : norm(pathname).startsWith(n.href);
        return (
          <Link
            key={n.href}
            href={n.href}
            aria-current={current ? "page" : undefined}
            className={cx("rounded-md px-2.5 py-1.5 text-sm", current ? "bg-accent-soft font-semibold text-accent" : "text-muted hover:text-text")}
          >
            {n.label}
          </Link>
        );
      })}
    </nav>
  );
}

function DemoControls() {
  const state = useDemoState();
  const api = useApi();
  const { userId, setUserId } = useActingAs();
  const [confirmReset, setConfirmReset] = useState(false);
  const users = Object.values(state.users);
  return (
    <div className="border-t border-border bg-surface-2">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-5 gap-y-2 px-4 py-2 text-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-muted">Planner clock (Europe/Brussels)</span>
          <time dateTime={state.now} className="tabular font-semibold" aria-live="polite" data-testid="demo-clock">
            {formatDayTime(state.now)}
          </time>
          <div role="group" aria-label="Advance the demo clock" className="flex gap-1">
            {[5, 15, 30].map((m) => (
              <Button key={m} onClick={() => api.advanceClock(m)} className="px-2 py-0.5">
                +{m} min
              </Button>
            ))}
          </div>
        </div>
        <div className="flex min-w-0 max-w-full flex-wrap items-center gap-2">
          <label htmlFor="acting-as" className="text-muted">
            Acting as
          </label>
          <select id="acting-as" value={userId} onChange={(e) => setUserId(e.target.value)} className={`${inputClass} max-w-full min-w-0`}>
            {users.map((u) => (
              <option key={u.userId} value={u.userId}>
                {u.name} — {u.title}
              </option>
            ))}
          </select>
        </div>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={api.faults.tmsUnavailable} onChange={(e) => api.setFault({ tmsUnavailable: e.target.checked })} />
          <span>Simulate TMS outage</span>
        </label>
        <div className="ml-auto flex items-center gap-2">
          {confirmReset ? (
            <>
              <span>Start the day again?</span>
              <Button
                variant="danger"
                onClick={() => {
                  api.reset();
                  setConfirmReset(false);
                }}
              >
                Yes, reset
              </Button>
              <Button onClick={() => setConfirmReset(false)}>Cancel</Button>
            </>
          ) : (
            <Button onClick={() => setConfirmReset(true)}>Reset demo</Button>
          )}
        </div>
      </div>
    </div>
  );
}
