# Facilitating a disagreement — simulated dialogue

> **What this is:** a reconstructed 15 minutes from the event storming, at hotspot H-02 ("key accounts: tell everything?"), showing how the facilitator moved two people with opposite requests to one decision owner and three options. Plus the discovery questions behind it. **For:** anyone preparing to facilitate, and interviewers who ask "how do you handle stakeholder conflict?". **Previous:** [event storming board](event-storming-board.md) · **Next:** [decision log](decision-log.md).

*Simulated. The people are roles in a fictional organisation; the words are written to show technique, not quoted from a real session. Facilitator notes in the right column explain why each move was made.*

## Setting

Phase 4 of the [agenda](event-storming-plan.md#agenda-3-hours-on-site-one-long-wall-figjam-board-as-a-remote-copy), "Who is told?". The board shows the orange events *Account manager informed* and *Customer e-mailed*, and two red stickies on the same spot: **"Key accounts must hear EVERYTHING"** (account manager) and **"No notification storm"** (senior planner). Seven dots on them after voting.

## The dialogue

| # | Speaker | Words | Facilitator's note |
|---|---|---|---|
| 1 | **Key account manager (KAM)** | "My accounts pay for service. If anything changes on their loads, they hear it from us. Every change." | A position, not yet a need. |
| 2 | **Senior road planner** | "Every change? A sailing moves twenty minutes three times a morning. I'm not spending my shift writing e-mails nobody reads." | Opposite position. Both are right about something. |
| 3 | **BA (facilitator)** | "Before we decide anything — can each of you tell me about the last time it went wrong? A real load." | Move from positions to a concrete story (same technique as in [discovery](../02-discovery/interview-notes.md#how-i-ran-discovery)). |
| 4 | KAM | "Northfield, three weeks ago. Reefer, missed the 06:00 slot, DC manager called *me* at seven. I hadn't heard a thing." | The need appears: *never surprised by something serious*. |
| 5 | Planner | "And I had six other trailers on that crossing. Two were fine, the window was wide. If I'd mailed all seven, four customers would have called asking why." | The other need: *only messages that matter*. |
| 6 | BA | "So what hurt at Northfield wasn't a missing update about twenty minutes. It was a serious delay, on a reefer, that nobody told them about. Is that fair?" — *KAM nods.* "And for you, the problem isn't telling customers — it's telling them things that don't change their day?" — *planner:* "Exactly." | Reflect each need back in their words; check agreement before moving on. |
| 7 | BA | *Writes on a yellow card:* "**Never surprise a key account with something serious**" and "**No message that doesn't change the customer's day**". "Can both of these be true at the same time?" | Make the two needs visible, side by side, as a shared problem. |
| 8 | Customer service agent | "Then we need to agree what 'serious' is. Today I decide that by the tone of the customer's voice." | The missing concept surfaces from a third person — *severity*. |
| 9 | Developer | "The TMS already knows the window and the ETA. If 'serious' is a number of minutes after the window, I can compute it." | The developer in the room turns an opinion into something buildable. |
| 10 | KAM | "Two hours late is serious for my accounts. For reefers, one hour." | First proposal for a threshold — note it, do not decide it. |
| 11 | Planner | "Two hours, fine. But if you make it one hour for everything, I'll get sixty percent more of them." | A real number from experience; later confirmed (see [why these thresholds](../05-requirements/exception-rules.md#why-these-thresholds)). |
| 12 | BA | "I'm hearing three possible answers. *(a)* every change to every customer; *(b)* every change, key accounts only; *(c)* by severity — serious delays to everyone, small ones only to customers who ask, and for key accounts a personal call when it's critical. I won't decide this here, and neither should the two of you alone." | Summarise options neutrally; separate *facilitating* from *deciding*. |
| 13 | Product Owner | "It's a backlog decision, so it's mine. Bring me (c) with the thresholds and what each threshold would have meant last month." | The decision owner claims it; the BA's homework is defined. |
| 14 | BA | "By Thursday: the three options, last month's 60 sampled orders run through each, and the number of messages per customer per option. Owner: PO. I'll put it on the hotspot." *Writes "H-02 → PO → Thu" on the red sticky.* | Owner, date and evidence — written where everyone sees it. |
| 15 | KAM | "And if the numbers say my accounts get fewer messages than today?" | Residual worry. |
| 16 | BA | "Then we show you which ones they *don't* get, and you tell us if any of those would have been a surprise. If yes, the threshold is wrong." | Give the sceptic a test, not a promise. |

## What came out of it

- **Severity** became the shared concept that resolved three hotspots at once (H-01, H-02, H-04) — see [what changed because of the session](event-storming-board.md#what-changed-because-of-the-session).
- The PO decided (c) in [D-02](decision-log.md#d-02); the planner's "60% more" became the reason major starts at 2 h, not 1 h.
- The KAM's test (line 16) became a review step: account managers went through the list of *non-notified* exceptions for their accounts in sprint 1's review. None would have been a surprise.

## Techniques used, by line

| Technique | Lines | Why it works |
|---|---|---|
| Ask for a concrete recent story | 3–5 | Stories carry needs; positions carry demands |
| Reflect back and check | 6 | People hear that they were understood before they hear a compromise |
| Make needs visible, side by side | 7 | Turns a fight between people into a problem on the wall |
| Let the room supply the missing concept | 8–9 | Ownership: nobody "loses" to the BA's idea |
| Separate options from the decision | 12–13 | Keeps the BA neutral and the PO accountable |
| Owner + date + evidence, written down | 14 | The hotspot leaves the room as work, not as a mood |
| Give a sceptic a falsifiable test | 16 | Trust comes from being allowed to prove you wrong |

## Discovery questions used before and during the workshop

| Theme | Question | Asked to |
|---|---|---|
| The last bad day | "Tell me about the last delay that went badly. What happened first? Who knew? Who should have known?" | everyone |
| Definitions | "When do *you* call a load late?" | CS, planners, KAM, customers |
| Today's workaround | "Show me how you find the affected orders when a sailing slips." (shadowing) | planners |
| Value | "If you heard at 10:00 instead of at the gate, what would you do differently?" | pilot customers |
| Volume and noise | "How many changes on a normal morning? How many matter?" | planners |
| Ownership | "Who should act on a customs hold? Who tells the customer?" | customs desk, CS |
| Risk | "What would make you switch this off in week one?" | planners, KAM, application support |
| Measurement | "How would we know in six weeks that it worked?" | PO, Head of CS |
| Constraints | "What may never appear in a customer message?" | DPO |

---

[Documentation map](../00-documentation-map.md) · Next: [Decision log →](decision-log.md)
