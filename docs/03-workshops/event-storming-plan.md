# Event storming — facilitation plan

> **What this is:** how I prepared and ran the big-picture event storming for this case, and why I chose the format. **For:** PO, Scrum Master and anyone who will facilitate the next session. **Previous:** [glossary](../02-discovery/glossary.md) · **Next:** [the board](event-storming-board.md).

*Simulated workshop for a fictional organisation. The plan is real; the participants and their contributions are illustrative.*

## Why event storming here

Discovery showed five contradictions ([C1–C5](../02-discovery/interview-notes.md#contradictions-taken-to-the-event-storming)) between people who rarely sit in one room: planners, customer service, account managers and the customs desk. A process diagram would have forced one person's view on the others. A timeline of **events** ("sailing delay published", "customer informed") lets everyone add what they see, and makes the disagreements visible as **hotspots** instead of hiding them in a document.

## Goal and output

- **Goal:** one shared timeline from "something changes on an order" to "exception closed", with the hotspots that block a design.
- **Output:** the board, a list of hotspots with an owner who decides, the glossary terms we argued about, candidate rules for severity and notification.
- **Not the goal:** designing screens or agreeing on the solution.

## Participants (8 + facilitator)

| Who | Why in the room |
|---|---|
| Senior road planner (UK delivery) + road planning lead | do the work today; own most exceptions |
| 2 customer-service agents (one senior) | take the WISMO calls |
| Key account manager | represents key-account expectations |
| Customs desk lead | owner of holds |
| Product Owner | decides on scope and priority hotspots |
| 1 developer | hears the domain first-hand; spots system events |
| BA (facilitator) | me |

The Head of Customer Service joined for the last 20 minutes to hear the hotspots, so agents could speak freely in the first part.

## Agenda (3 hours, on site, one long wall; FigJam board as a remote copy)

| Time | Block | What happens | Technique |
|---|---|---|---|
| 0:00 | Kick-off (10 min) | Goal, rules: one event per sticky, past tense, orange; no solutions yet | — |
| 0:10 | Chaotic exploration (30 min) | Everyone writes events silently and puts them on the wall | silent brainstorming |
| 0:40 | Enforce the timeline (30 min) | Order the events, remove duplicates, find the pivotal events | walk the timeline aloud |
| 1:10 | Break | — | — |
| 1:20 | People and systems (30 min) | Add actors (yellow) and external systems (pink) | — |
| 1:50 | Hotspots (25 min) | Red stickies where people disagree or do not know | dot voting on the top 5 |
| 2:15 | Policies and read models (25 min) | Lilac "whenever… then…" rules; green: what someone needs to see to decide | — |
| 2:40 | Hotspot owners (15 min) | Each top hotspot gets one decision owner and a date | — |
| 2:55 | Close (5 min) | What happens next: options per hotspot for the owners within one week | — |

## Facilitation choices

- **Silent writing first**, so the most senior person does not set the tone.
- **"Last delay that went badly"** as the starting story, as in discovery: concrete beats abstract.
- **No laptop at the wall** except the developer's, who adds system events.
- **Parking lot** for solution ideas ("a tracking map!"): written down, not discussed.
- **I do not decide hotspots.** I prepare options with consequences; the owner decides. That is in the [decision log](decision-log.md).

## Materials

Orange, blue, yellow, lilac, pink, green and red stickies; 8 m of paper; markers; dot stickers. Remote copy in FigJam with the same colour legend so that the developer team abroad could follow.

---

[Documentation map](../00-documentation-map.md) · Next: [The board →](event-storming-board.md)
