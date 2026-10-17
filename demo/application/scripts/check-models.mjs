#!/usr/bin/env node
// Validates the BPMN 2.0 and DMN 1.3 files against their meta-models (bpmn-moddle, dmn-moddle):
// unknown elements, wrong attributes and unresolved references are warnings — and warnings fail the check.
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import BpmnModdle from "bpmn-moddle";
import DmnModdle from "dmn-moddle";

const repo = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const sets = [
  ["docs/04-process/bpmn", ".bpmn", (xml) => new BpmnModdle().fromXML(xml)],
  ["docs/05-requirements/dmn", ".dmn", (xml) => new DmnModdle().fromXML(xml, "dmn:Definitions")],
];
let failed = 0;
for (const [dir, ext, parse] of sets) {
  for (const f of readdirSync(join(repo, dir)).filter((x) => x.endsWith(ext))) {
    const { warnings } = await parse(readFileSync(join(repo, dir, f), "utf8"));
    if (warnings.length) failed++;
    console.log(`${warnings.length ? "FAIL" : "OK  "} ${dir}/${f}${warnings.length ? ` — ${warnings.map((w) => w.message).join("; ")}` : ""}`);
  }
}
process.exit(failed ? 1 : 0);
