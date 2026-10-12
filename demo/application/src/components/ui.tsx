// Small, accessible building blocks of the control tower's design system.
// Severity and status are always shown as text, never by colour alone (WCAG 1.4.1).
import Link from "next/link";
import type { ReactNode } from "react";
import type { ExceptionStatus, MessageStatus, Severity } from "@/domain/types";

export function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

const SEVERITY_STYLE: Record<Severity, string> = {
  CRITICAL: "bg-critical-soft text-critical border-critical",
  MAJOR: "bg-major-soft text-major border-major",
  MINOR: "bg-minor-soft text-minor border-border",
  NONE: "bg-ok-soft text-ok border-ok",
};
const SEVERITY_ICON: Record<Severity, string> = { CRITICAL: "▲▲", MAJOR: "▲", MINOR: "●", NONE: "✓" };
const SEVERITY_TEXT: Record<Severity, string> = { CRITICAL: "Critical", MAJOR: "Major", MINOR: "Minor", NONE: "On time" };

export function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span className={cx("inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-xs font-semibold whitespace-nowrap", SEVERITY_STYLE[severity])}>
      <span aria-hidden="true" className="text-[10px]">
        {SEVERITY_ICON[severity]}
      </span>
      {SEVERITY_TEXT[severity]}
    </span>
  );
}

const STATUS_STYLE: Record<ExceptionStatus, string> = {
  OPEN: "bg-info-soft text-info",
  HELD: "bg-major-soft text-major",
  ESCALATED: "bg-critical-soft text-critical",
  ACKNOWLEDGED: "bg-surface-2 text-text",
  RECOVERED: "bg-ok-soft text-ok",
  RESOLVED: "bg-ok-soft text-ok",
  CLOSED: "bg-surface-2 text-muted",
};
export const STATUS_TEXT: Record<ExceptionStatus, string> = {
  OPEN: "Open",
  HELD: "Held — confirm first",
  ESCALATED: "Escalated",
  ACKNOWLEDGED: "Acknowledged",
  RECOVERED: "Recovered",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
};

export function StatusBadge({ status }: { status: ExceptionStatus }) {
  return <span className={cx("inline-flex rounded px-1.5 py-0.5 text-xs font-medium whitespace-nowrap", STATUS_STYLE[status])}>{STATUS_TEXT[status]}</span>;
}

const MESSAGE_TEXT: Record<MessageStatus, string> = {
  SENT: "Sent",
  PENDING_NOTE: "Waiting for planner note",
  SHADOW: "Shadow — not sent",
  SUPPRESSED: "Throttled — not sent",
  NOT_IN_RELEASE: "Release 2 — not sent",
  WITHDRAWN: "Withdrawn — not sent",
};
export function MessageStatusBadge({ status }: { status: MessageStatus }) {
  const tone = status === "SENT" ? "bg-ok-soft text-ok" : status === "PENDING_NOTE" ? "bg-major-soft text-major" : "bg-surface-2 text-muted";
  return <span className={cx("inline-flex rounded px-1.5 py-0.5 text-xs font-medium whitespace-nowrap", tone)}>{MESSAGE_TEXT[status]}</span>;
}

export function PageHeader({ title, intro, children }: { title: string; intro?: ReactNode; children?: ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div className="max-w-3xl">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {intro && <p className="mt-1 text-muted">{intro}</p>}
      </div>
      {children}
    </div>
  );
}

export function Card({ title, children, className, actions, id }: { title?: ReactNode; children: ReactNode; className?: string; actions?: ReactNode; id?: string }) {
  return (
    <section id={id} aria-label={typeof title === "string" ? title : undefined} className={cx("rounded-lg border border-border bg-surface", className)}>
      {(title || actions) && (
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-2.5">
          {title && <h2 className="text-base font-semibold">{title}</h2>}
          {actions}
        </div>
      )}
      <div className="p-4">{children}</div>
    </section>
  );
}

export function KpiTile({ label, value, hint, tone = "neutral", href }: { label: string; value: ReactNode; hint?: ReactNode; tone?: "neutral" | "critical" | "major" | "ok"; href?: string }) {
  const toneClass = { neutral: "", critical: "border-l-4 border-l-critical", major: "border-l-4 border-l-major", ok: "border-l-4 border-l-ok" }[tone];
  const body = (
    <>
      <p className="text-sm text-muted">{label}</p>
      <p className="tabular mt-1 text-3xl font-semibold">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </>
  );
  const cls = cx("block rounded-lg border border-border bg-surface p-4", toneClass, href && "hover:border-accent");
  return href ? (
    <Link href={href} className={cls}>
      {body}
    </Link>
  ) : (
    <div className={cls}>{body}</div>
  );
}

export function Button({
  children,
  onClick,
  variant = "secondary",
  disabled,
  type = "button",
  title,
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  disabled?: boolean;
  type?: "button" | "submit";
  title?: string;
  className?: string;
}) {
  const styles = {
    primary: "bg-accent text-accent-text border-accent hover:opacity-90",
    secondary: "bg-surface text-text border-border hover:border-accent",
    danger: "bg-surface text-critical border-critical hover:bg-critical-soft",
    ghost: "bg-transparent text-accent border-transparent hover:underline",
  }[variant];
  return (
    <button type={type} onClick={onClick} disabled={disabled} title={title} className={cx("inline-flex items-center justify-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50", styles, className)}>
      {children}
    </button>
  );
}

export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <div role="status" aria-live="polite" className="rounded-lg border border-dashed border-border p-6 text-center text-muted">
      <span className="mr-2 inline-block h-3 w-3 animate-pulse rounded-full bg-accent align-middle" aria-hidden="true" />
      {label}
    </div>
  );
}

export function ErrorState({ title, detail, onRetry }: { title: string; detail: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="rounded-lg border border-critical bg-critical-soft p-4 text-critical">
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-sm">{detail}</p>
      {onRetry && (
        <Button onClick={onRetry} className="mt-3">
          Try again
        </Button>
      )}
    </div>
  );
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed border-border p-6 text-center">
      <p className="font-medium">{title}</p>
      {children && <div className="mt-1 text-sm text-muted">{children}</div>}
    </div>
  );
}

export function InlineError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-2 rounded border border-critical bg-critical-soft px-3 py-2 text-sm text-critical">
      {message}
    </p>
  );
}

export function RuleChip({ id, text }: { id: string; text?: string }) {
  return (
    <abbr title={text} className="inline-flex rounded border border-border bg-surface-2 px-1.5 py-0.5 font-mono text-xs no-underline">
      {id}
    </abbr>
  );
}

export function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="text-accent underline underline-offset-2">
      {children}
      <span className="sr-only"> (opens on GitHub in a new tab)</span>
    </a>
  );
}

export function Field({ label, htmlFor, hint, children }: { label: string; htmlFor: string; hint?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-muted">{hint}</p>}
    </div>
  );
}

export const inputClass = "rounded-md border border-border bg-surface px-2.5 py-1.5 text-sm text-text";
