# Interview notes

> **What this is:** condensed notes from seven discovery conversations and one shadowing session, with the contradictions left in. **For:** PO and team; the source for the event storming hotspots. **Previous:** [stakeholders](stakeholders.md) · **Next:** [glossary](glossary.md).

*Simulated discovery for a fictional organisation. The notes show how I run and record discovery, not real conversations.*

## How I ran discovery

- 45-minute semi-structured interviews, one role at a time, so that nobody adjusted their answer to their manager.
- Same opening question for everyone: *"Tell me about the last delay that went badly. What happened, hour by hour?"* Stories give facts; opinions come later.
- One morning shadowing the UK delivery planners (06:00–10:00), because what people say they do and what they do differ.
- Every note ends with **open questions** and **contradictions**; those went straight to the event storming board.

## 1. Head of Customer Service

- "Since the new TMS, customers can see statuses. They still call, because 'arrived at terminal' does not tell them if they need to move their dock staff."
- Wants "a tracking page like a parcel carrier". When asked what the customer would *do* with it: "Know if they're going to be late." → the need is the **consequence for the window**, not the position.
- Agents ask planners via chat. Average wait for an answer: 10–20 minutes, so agents call the customer back.
- Contact reasons are not tagged consistently. Offered to run two weeks of tagging. (Result: ±38% WISMO.)

## 2. Senior road planner, UK delivery (+ shadowing)

- Starts the shift by reading the overnight sailing messages and the haulier WhatsApp group. Copies affected orders into the "disruption sheet".
- "I call my important customers myself. If the system starts sending messages, they'll get two different stories."
- Observed: in 4 hours, 11 calls or chats from customer service, each interrupting re-planning. Two delays were noticed only when the customer called.
- Hauliers without the app give status by phone; "no status" usually means "no app", not "a problem". → **false alarm risk** for any rule on missing status.

## 3. Road planning lead

- Main fear: notification storm. "A sailing moves three times in an evening. Do we send three messages? Then the customer calls to ask which one is true."
- Wants owners per type: "If it's customs, it's not my planner's problem."
- Accepts a work list "if it replaces the Excel, not if it comes on top".

## 4. Key account manager

- "Every delay to a key account must be communicated." When asked about a 20-minute delay inside the window: "Well, no, not that."
- Wants a call, not an e-mail, when a key account's delivery is at serious risk.
- **Contradiction with #2 and #3:** account managers want more communication; planners want fewer messages. Both are right for different severities.

## 5. Customs desk lead

- Holds are mostly missing documents (commodity codes, invoice values). "The customer has to act, and fast, but we e-mail the forwarder, who e-mails the shipper…"
- Not part of the pilot route cluster's priority; customs messages go into release 2.

## 6. Pilot customer A — transport manager, food producer (reefer, key account)

- Plans dock staff per hour. "A late trailer I can handle; a late trailer I hear about at the gate costs me a crew standing around."
- Wants: new ETA, reason in plain words, "and if it's tomorrow, ask me for a new slot".
- Does not want: a message for every status ("I'd make a rule to delete them").

## 7. Pilot customer B — forwarder with EDI

- "Give me a status message I can process; my customer asks me, not you." → EDI/API status message (release 2).
- Receives orders from many carriers; consistency of reason codes matters more than prose.

## 8. Application support lead

- "We learn about new features from the first ticket." Wants the KB article and a demo before go-live.
- Typical tickets after the TMS go-live: "customer didn't get an e-mail" — usually a wrong contact address. → data quality check on contacts before the pilot.

## Contradictions taken to the event storming

| # | Contradiction | Between |
|---|---|---|
| C1 | "Late" means after planned ETA (planner) vs. after the window (customer) vs. after the slot booked at the consignee (CS) | planners, CS, customers |
| C2 | Tell key accounts everything vs. fewer messages | account managers vs. planning |
| C3 | Missing status is an alarm vs. usually nothing | CS vs. planners |
| C4 | Planner calls key accounts personally vs. one system message | senior planner vs. PO |
| C5 | Customs is "everyone's problem" vs. the customs desk owns it | planning vs. customs |

## Open questions after discovery

- Is the delivery window filled in reliably in the TMS? (→ A-02: no, 72%)
- Can the TMS send a webhook for ETA changes, or only for status changes? (→ spike: both)
- May we tell the customer the reason for a delay (for example "technical inspection")? (→ yes, reason category only, agreed with commercial)

---

[Documentation map](../00-documentation-map.md) · Next: [Glossary →](glossary.md)
