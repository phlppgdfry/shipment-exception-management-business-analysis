# ADR-002 — Business rules in one portable module

**Status:** accepted · **Deciders:** PO, architect, BA · **Follows from:** [D-02](../../03-workshops/decision-log.md#d-02), NFR-09

## Context

Severity, ownership and notification rules are the product. Thresholds will change after the pilot. Rules scattered across services, templates and UI code drift apart; a move to a supplier module later would mean re-discovering them.

## Options

| Option | For | Against |
|---|---|---|
| Rules in the service code, documented in prose | familiar | prose and code drift; PO cannot see impact of a change |
| Rules engine product (BRMS) | business-editable | licence, operation and skills for 13 rules |
| **One pure module + executable examples + DMN** | small, testable, portable; examples are the spec | changes still need a release (mitigated by parameters) |

## Decision

One side-effect-free module (`exception-rules.mjs`) with parameters for thresholds. The 30 Given/When/Then examples are the specification and run in CI; the same table is published as [DMN 1.3](../../05-requirements/dmn/exception-decisions.dmn), and a test proves DMN and module agree on 912 combinations. Stateful policies (throttling, recovery) stay in the module, not in DMN.

## Consequences

- The prototype, the control tower and the tests import the same file — no second implementation.
- A threshold change shows exactly which examples change meaning before it is merged.
- If a DMN engine is adopted later, the DMN file is the starting point and the examples are its regression suite.
