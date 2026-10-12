"use client";
// Acceptance examples with the rules they exercise and their actual test result. ?rules=ER-04,ER-11 filters.
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { RULE_TEXT } from "@/domain/rules";
import { RuleChip, cx } from "./ui";

export interface ExampleRow {
  id: string;
  title: string;
  given: string;
  expected: string;
  rules: string[];
  status: "passed" | "failed" | "skipped" | "not run";
}

export function ExampleTable({ rows }: { rows: ExampleRow[] }) {
  return (
    <Suspense fallback={<Table rows={rows} filter={[]} />}>
      <Filtered rows={rows} />
    </Suspense>
  );
}

function Filtered({ rows }: { rows: ExampleRow[] }) {
  const params = useSearchParams();
  const filter = (params.get("rules") ?? "").split(",").filter(Boolean);
  return <Table rows={rows} filter={filter} />;
}

function Table({ rows, filter }: { rows: ExampleRow[]; filter: string[] }) {
  // Rules every decision fires (ER-01, ER-08, ER-09) do not narrow anything; filter on the distinctive ones.
  const distinctive = filter.filter((r) => !["ER-01", "ER-08", "ER-09"].includes(r));
  const shown = distinctive.length ? rows.filter((r) => distinctive.some((d) => r.rules.includes(d))) : rows;
  return (
    <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Table, scrolls sideways on small screens">
      {distinctive.length > 0 && (
        <p className="mb-2 text-sm">
          Showing the {shown.length} examples that exercise {distinctive.join(", ")} — the rules behind the exception you came from. <a href="?#examples" className="text-accent underline">Show all</a>
        </p>
      )}
      <table className="w-full text-sm">
        <caption className="sr-only">Executable acceptance examples with their test result</caption>
        <thead className="text-left text-muted">
          <tr className="border-b border-border">
            {["Example", "Given", "Then", "Rules exercised", "Test result"].map((h) => <th key={h} scope="col" className="py-1.5 pr-3 font-medium">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {shown.map((r) => (
            <tr key={r.id} className="border-b border-border align-top last:border-0">
              <th scope="row" className="py-1.5 pr-3 text-left font-normal"><span className="font-mono text-xs">{r.id}</span> <span className="block">{r.title}</span></th>
              <td className="py-1.5 pr-3 text-muted">{r.given}</td>
              <td className="py-1.5 pr-3 font-mono text-xs">{r.expected}</td>
              <td className="py-1.5 pr-3"><span className="flex flex-wrap gap-1">{r.rules.map((id) => <RuleChip key={id} id={id} text={RULE_TEXT[id]} />)}</span></td>
              <td className="py-1.5"><span className={cx("rounded px-1.5 py-0.5 text-xs font-semibold", r.status === "passed" ? "bg-ok-soft text-ok" : r.status === "failed" ? "bg-critical-soft text-critical" : "bg-surface-2 text-muted")}>{r.status === "passed" ? "✓ passed" : r.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
