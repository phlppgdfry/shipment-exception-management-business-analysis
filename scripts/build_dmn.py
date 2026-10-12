#!/usr/bin/env python3
"""Build the exception decision tables as DMN 1.3 (docs/05-requirements/dmn/exception-decisions.dmn).

Three decisions, as in the decision table of docs/05-requirements/exception-rules.md:
  Base severity (hit policy FIRST)  — ER-01, ER-02, ER-03, ER-05, ER-06, ER-07
  Severity      (hit policy UNIQUE) — ER-04, time-critical one level up
  Customer notification (FIRST)     — ER-06, ER-07, ER-10, ER-11
Throttling (ER-12) and recovery (ER-13) depend on what was told before; they are stateful and stay in the
rule module, not in DMN. tests/dmn-consistency.test.mjs checks that these tables and the rule module agree.
Run: python3 scripts/build_dmn.py — opens in Camunda Modeler or demo.bpmn.io (DMN).
"""
from __future__ import annotations

from html import escape
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "docs/05-requirements/dmn/exception-decisions.dmn"
ALWAYS = '"SAILING_CANCELLED","CUSTOMS_HOLD","STATUS_MISSING"'

DECISIONS = [
    {
        "id": "base_severity", "name": "Base severity", "hit": "FIRST", "requires": [],
        "inputs": [("cause", "Cause", "string"), ("minutesLate", "Minutes after the end of the window", "number"), ("nextDay", "Moves to another day", "boolean")],
        "output": ("baseSeverity", "Base severity", "string"),
        "rules": [
            (f"not({ALWAYS})", "<= 0", "false", '"NONE"', "ER-01: inside the agreed window is not an exception"),
            ('"SAILING_CANCELLED"', "-", "-", '"CRITICAL"', "ER-05: a cancelled sailing is always critical"),
            ('"CUSTOMS_HOLD"', "-", "-", '"MAJOR"', "ER-06: customs hold is major"),
            ('"STATUS_MISSING"', "-", "-", '"MAJOR"', "ER-07: missing status is major (held)"),
            ("-", "-", "true", '"CRITICAL"', "ER-03: delivery moves to another day"),
            ("-", ">= 360", "false", '"CRITICAL"', "ER-02: 360 min or more"),
            ("-", "[120..360)", "false", '"MAJOR"', "ER-02: 120–359 min"),
            ("-", "(0..120)", "false", '"MINOR"', "ER-02: 1–119 min"),
        ],
    },
    {
        "id": "severity", "name": "Severity", "hit": "UNIQUE", "requires": ["base_severity"],
        "inputs": [("baseSeverity", "Base severity", "string"), ("timeCritical", "Reefer or time-critical", "boolean")],
        "output": ("severity", "Severity", "string"),
        "rules": [
            ('"NONE"', "-", '"NONE"', "no exception"),
            ('not("NONE")', "false", "baseSeverity", "not time-critical: unchanged"),
            ('"MINOR"', "true", '"MAJOR"', "ER-04: one level up"),
            ('"MAJOR"', "true", '"CRITICAL"', "ER-04: one level up"),
            ('"CRITICAL"', "true", '"CRITICAL"', "ER-04: maximum critical"),
        ],
    },
    {
        "id": "notification", "name": "Customer notification", "hit": "FIRST", "requires": ["severity"],
        "inputs": [("cause", "Cause", "string"), ("severity", "Severity", "string"), ("keyAccount", "Key account", "boolean"), ("prefersAllUpdates", "Wants every update", "boolean")],
        "output": ("notification", "Customer notification (before throttling, ER-12)", "string"),
        "rules": [
            ('"STATUS_MISSING"', "-", "-", "-", '"HOLD"', "ER-07: planner confirms first"),
            ('"CUSTOMS_HOLD"', "-", "-", "-", '"ACTION_REQUIRED"', "ER-06: the customer must act"),
            ("-", '"NONE"', "-", "-", '"NONE"', "no exception"),
            ("-", '"MINOR"', "-", "true", '"NOTIFY"', "ER-10: minor only if opted in"),
            ("-", '"MINOR"', "-", "false", '"NONE"', "ER-10: minor is monitored"),
            ("-", '"CRITICAL"', "true", "-", '"NOTIFY_AND_CALL"', "ER-11: critical key account also gets a call"),
            ("-", "-", "-", "-", '"NOTIFY"', "ER-10: major and critical are notified"),
        ],
    },
]


def build() -> str:
    o = ['<?xml version="1.0" encoding="UTF-8"?>',
         '<definitions xmlns="https://www.omg.org/spec/DMN/20191111/MODEL/" xmlns:dmndi="https://www.omg.org/spec/DMN/20191111/DMNDI/" '
         'xmlns:dc="http://www.omg.org/spec/DMN/20180521/DC/" xmlns:di="http://www.omg.org/spec/DMN/20180521/DI/" '
         'id="exception_decisions" name="Shipment exception decisions" namespace="https://github.com/phlppgdfry/shipment-exception-management-business-analysis" '
         'exporter="build_dmn.py" exporterVersion="1">']
    for d in DECISIONS:
        o.append(f'  <decision id="{d["id"]}" name="{escape(d["name"])}">')
        for req in d["requires"]:
            o.append(f'    <informationRequirement id="req_{d["id"]}_{req}"><requiredDecision href="#{req}" /></informationRequirement>')
        o.append(f'    <decisionTable id="table_{d["id"]}" hitPolicy="{d["hit"]}">')
        for i, (expr, label, typ) in enumerate(d["inputs"]):
            o.append(f'      <input id="in_{d["id"]}_{i}" label="{escape(label)}"><inputExpression id="ie_{d["id"]}_{i}" typeRef="{typ}"><text>{expr}</text></inputExpression></input>')
        name, label, typ = d["output"]
        o.append(f'      <output id="out_{d["id"]}" label="{escape(label)}" name="{name}" typeRef="{typ}" />')
        for r, rule in enumerate(d["rules"]):
            *entries, out, note = rule
            o.append(f'      <rule id="r_{d["id"]}_{r + 1}">')
            o.append(f'        <description>{escape(note)}</description>')
            for e in entries:
                o.append(f'        <inputEntry><text>{escape(e)}</text></inputEntry>')
            o.append(f'        <outputEntry><text>{escape(out)}</text></outputEntry>')
            o.append('      </rule>')
        o.append('    </decisionTable>')
        o.append('  </decision>')
    o.append('  <dmndi:DMNDI><dmndi:DMNDiagram id="DMNDiagram_1">')
    for i, d in enumerate(DECISIONS):
        o.append(f'    <dmndi:DMNShape id="shape_{d["id"]}" dmnElementRef="{d["id"]}"><dc:Bounds x="{160 + i * 220}" y="{300 - i * 110}" width="180" height="80" /></dmndi:DMNShape>')
    for d in DECISIONS:
        for req in d["requires"]:
            i_req = [x["id"] for x in DECISIONS].index(req)
            i_d = [x["id"] for x in DECISIONS].index(d["id"])
            o.append(f'    <dmndi:DMNEdge id="edge_{d["id"]}_{req}" dmnElementRef="req_{d["id"]}_{req}">'
                     f'<di:waypoint x="{250 + i_req * 220}" y="{300 - i_req * 110}" /><di:waypoint x="{250 + i_d * 220}" y="{380 - i_d * 110}" /></dmndi:DMNEdge>')
    o.append('  </dmndi:DMNDiagram></dmndi:DMNDI>')
    o.append('</definitions>')
    return "\n".join(o) + "\n"


if __name__ == "__main__":
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(build(), encoding="utf-8")
    print(f"wrote {OUT.relative_to(ROOT)}")
