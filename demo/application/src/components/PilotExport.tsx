"use client";
import { useMemo } from "react";
import { EXPORT_COLUMNS, pilotExportCsv } from "@/domain/pilot-export";
import { useDemoState } from "@/state/store";

export function PilotExport() {
  const state = useDemoState();
  const csv = useMemo(() => pilotExportCsv(state), [state]);
  const rows = csv.trim().split("\n").length - 1;
  const href = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;
  return (
    <div className="text-sm">
      <p>
        One row per exception with the timestamps the KPIs need (AC-13.2): <code className="font-mono text-xs">{EXPORT_COLUMNS.join(", ")}</code>. Includes the control group (shadow mode), so the stage gate can compare pilot against control.
      </p>
      <a href={href} download="pilot-measurements-demo.csv" className="mt-3 inline-flex rounded-md border border-accent bg-accent px-3 py-1.5 font-medium text-accent-text">
        Download today’s export ({rows} exceptions, CSV)
      </a>
      <p className="mt-2 text-xs text-muted">Generated in your browser from this demo session. In the proposed service the export is available to the PO and the Head of Customer Service only (AC-13.3).</p>
    </div>
  );
}
