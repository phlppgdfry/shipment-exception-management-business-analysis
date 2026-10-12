#!/usr/bin/env python3
"""Build the AS-IS and TO-BE process models as BPMN 2.0 XML (with diagram interchange) and SVG.

The models are kept as small Python structures so they stay reviewable in a pull request.
Outputs:
  docs/04-process/bpmn/<name>.bpmn   opens in Camunda Modeler or bpmn.io
  site/assets/bpmn/<name>.svg        rendered for the site and the Markdown docs
Run: python3 scripts/build_bpmn.py
"""
from __future__ import annotations

from html import escape
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LANE_H, COL_W, HEADER_W, LEFT_PAD = 130, 158, 34, 30
TASK_W, TASK_H, EVENT, GATE = 118, 66, 36, 50

AS_IS = {
    "id": "as_is",
    "name": "AS-IS: a sailing is delayed (today)",
    "lanes": [
        ("customer", "Customer"),
        ("cs", "Customer service"),
        ("am", "Account manager"),
        ("planner", "Road planner"),
        ("systems", "Sailing system / TMS"),
    ],
    "nodes": [
        ("start", "messageStart", "systems", 0, "Sailing delay published"),
        ("t_tms", "serviceTask", "systems", 1, "Order ETAs stay on the old plan"),
        ("t_notice", "userTask", "planner", 1, "Notices delay (chat, e-mail, screen)"),
        ("t_excel", "userTask", "planner", 2, "Looks up affected orders in Excel"),
        ("t_replan", "userTask", "planner", 3, "Re-plans haulier where possible"),
        ("g_key", "xor", "am", 3, "Key account and AM knows?"),
        ("t_mail", "userTask", "am", 4, "E-mails customer"),
        ("t_wait", "task", "customer", 4, "Waits at the delivery slot"),
        ("t_call", "task", "customer", 5, "Calls: where is my load?"),
        ("t_ask", "userTask", "cs", 5, "Asks planner by phone or chat"),
        ("t_answer", "userTask", "cs", 6, "Answers customer, logs nothing"),
        ("end", "end", "customer", 7, "Customer informed, often late"),
    ],
    "flows": [
        ("start", "t_tms", ""), ("start", "t_notice", ""), ("t_notice", "t_excel", ""), ("t_excel", "t_replan", ""),
        ("t_replan", "g_key", ""), ("g_key", "t_mail", "yes"), ("g_key", "t_wait", "no", "vh"), ("t_mail", "end", "", "hv"),
        ("t_wait", "t_call", ""), ("t_call", "t_ask", ""), ("t_ask", "t_answer", ""), ("t_answer", "end", ""),
    ],
    "pain": {"t_tms": "P1", "t_notice": "P2", "t_excel": "P3", "g_key": "P4", "t_call": "P5", "t_answer": "P6"},
}

TO_BE = {
    "id": "to_be",
    "name": "TO-BE: exception management (release 1)",
    "lanes": [
        ("customer", "Customer"),
        ("cs", "Customer service"),
        ("lead", "Shift lead"),
        ("planner", "Road planner"),
        ("rules", "Exception component"),
        ("tms", "TMS"),
    ],
    "nodes": [
        ("start", "messageStart", "tms", 0, "Status, ETA or sailing change"),
        ("t_eval", "serviceTask", "rules", 1, "Evaluate exception rules"),
        ("g_exc", "xor", "rules", 2, "Exception?"),
        ("end_none", "end", "tms", 3, "No action"),
        ("t_open", "serviceTask", "rules", 3, "Open exception: severity, owner, response time"),
        ("g_notify", "xor", "rules", 4, "Customer notification?"),
        ("t_send", "sendTask", "customer", 5, "Proactive message (portal + e-mail)"),
        ("t_calltask", "userTask", "cs", 5, "Call key account (critical only)"),
        ("t_confirm", "userTask", "planner", 5, "Hold: confirm with haulier"),
        ("g_conf", "xor", "planner", 6, "Confirmed?"),
        ("end_fa", "end", "rules", 6, "Closed as false alarm, no message"),
        ("t_chase", "userTask", "lead", 5, "Chase haulier; hold stays (D-09)"),
        ("end_chase", "end", "lead", 6, "Hold kept"),
        ("t_ack", "userTask", "planner", 7, "Acknowledge within response time"),
        ("t_esc", "userTask", "lead", 7, "Assign a planner"),
        ("t_replan", "userTask", "planner", 8, "Re-plan delivery, agree new window"),
        ("t_update", "serviceTask", "tms", 9, "New ETA published"),
        ("t_resolve", "userTask", "planner", 10, "Resolve with reason code"),
        ("end", "end", "planner", 11, "Exception closed, KPIs logged"),
    ],
    # Timer boundary events (ER-09): (id, host task, interrupting?, label, timer expression)
    "boundaries": [
        ("b_sla", "t_ack", True, "Response time passed (ER-09)", "=responseTime"),
        ("b_hold", "t_confirm", False, "Response time passed (D-09)", "=responseTime"),
    ],
    "flows": [
        ("start", "t_eval", ""), ("t_eval", "g_exc", ""), ("g_exc", "end_none", "no", "vh"), ("g_exc", "t_open", "yes"),
        ("t_open", "g_notify", ""), ("g_notify", "t_send", "notify", "vh"), ("g_notify", "t_calltask", "notify + call", "vh"),
        ("g_notify", "t_confirm", "hold", "vh"), ("t_send", "t_ack", ""), ("t_calltask", "t_ack", ""),
        ("t_confirm", "g_conf", ""), ("g_conf", "t_ack", "delay"), ("g_conf", "end_fa", "on time"),
        ("b_hold", "t_chase", "", "v"), ("t_chase", "end_chase", ""),
        ("t_ack", "t_replan", ""), ("b_sla", "t_esc", "", "v"), ("t_esc", "t_replan", ""),
        ("t_replan", "t_update", ""), ("t_update", "t_resolve", "re-evaluated"), ("t_resolve", "end", ""),
    ],
    "pain": {},
    "fixes": {"t_eval": "P1", "t_open": "P2 P3", "t_send": "P4 P5", "t_resolve": "P6"},
}

TAGS = {
    "messageStart": "startEvent", "start": "startEvent", "end": "endEvent", "task": "task", "userTask": "userTask",
    "serviceTask": "serviceTask", "sendTask": "sendTask", "xor": "exclusiveGateway",
}


def size(kind: str) -> tuple[int, int]:
    if kind in ("messageStart", "start", "end"):
        return EVENT, EVENT
    if kind == "xor":
        return GATE, GATE
    return TASK_W, TASK_H


def layout(model: dict) -> dict:
    lanes = {lane_id: i for i, (lane_id, _) in enumerate(model["lanes"])}
    boxes = {}
    for node_id, kind, lane, col, _ in model["nodes"]:
        w, h = size(kind)
        cx = HEADER_W + LEFT_PAD + col * COL_W + TASK_W / 2
        cy = lanes[lane] * LANE_H + LANE_H / 2
        boxes[node_id] = (cx - w / 2, cy - h / 2, w, h)
    for b_id, host, *_ in model.get("boundaries", []):
        hx, hy, hw, _ = boxes[host]
        boxes[b_id] = (hx + hw - 12 - EVENT / 2, hy - EVENT / 2, EVENT, EVENT)
    return boxes


def waypoints(a: tuple, b: tuple, route: str = "gap") -> list[tuple[float, float]]:
    """Orthogonal routing. 'gap': leave right, turn in the gap between columns. 'hv': run along the source lane, enter the target vertically."""
    ax, ay, aw, ah = a
    bx, by, bw, bh = b
    acx, acy, bcx, bcy = ax + aw / 2, ay + ah / 2, bx + bw / 2, by + bh / 2
    if abs(acy - bcy) < 1:
        return [(ax + aw, acy), (bx, bcy)] if bcx > acx else [(ax, acy), (bx + bw, bcy)]
    if abs(acx - bcx) < 1:
        return [(acx, ay + ah), (bcx, by)] if bcy > acy else [(acx, ay), (bcx, by + bh)]
    if route == "v":  # straight up or down, e.g. from a boundary event to the task above it
        return [(acx, ay if bcy < acy else ay + ah), (acx, by + bh if bcy < acy else by)]
    if route == "vh":
        return [(acx, ay + ah if bcy > acy else ay), (acx, bcy), (bx, bcy)]
    if route == "hv":
        return [(ax + aw, acy), (bcx, acy), (bcx, by if bcy > acy else by + bh)]
    gap = bx - (COL_W - TASK_W) / 2 if bcx > acx else bx + bw + (COL_W - TASK_W) / 2
    return [(ax + aw, acy), (gap, acy), (gap, bcy), (bx, bcy)]


def bpmn_xml(model: dict, boxes: dict) -> str:
    pid, pname = f"Process_{model['id']}", model["name"]
    width = HEADER_W + LEFT_PAD * 2 + (max(c for *_, c, _ in model["nodes"]) + 1) * COL_W
    height = LANE_H * len(model["lanes"])
    incoming, outgoing = {}, {}
    for i, (s, t, *_) in enumerate(model["flows"]):
        outgoing.setdefault(s, []).append(f"Flow_{i}")
        incoming.setdefault(t, []).append(f"Flow_{i}")

    out = ['<?xml version="1.0" encoding="UTF-8"?>',
           '<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" '
           'xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" '
           'xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" '
           'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" '
           f'id="Defs_{model["id"]}" targetNamespace="https://github.com/phlppgdfry/shipment-exception-management-business-analysis" '
           'exporter="build_bpmn.py" exporterVersion="1">',
           f'  <bpmn:collaboration id="Collab_{model["id"]}">',
           f'    <bpmn:participant id="Pool_{model["id"]}" name="{escape(pname)}" processRef="{pid}" />',
           '  </bpmn:collaboration>',
           f'  <bpmn:process id="{pid}" isExecutable="false">',
           f'    <bpmn:laneSet id="LaneSet_{model["id"]}">']
    for lane_id, lane_name in model["lanes"]:
        out.append(f'      <bpmn:lane id="Lane_{lane_id}" name="{escape(lane_name)}">')
        for node_id, _, lane, _, _ in model["nodes"]:
            if lane == lane_id:
                out.append(f'        <bpmn:flowNodeRef>{node_id}</bpmn:flowNodeRef>')
        for b_id, host, *_ in model.get("boundaries", []):
            if {n[0]: n[2] for n in model["nodes"]}[host] == lane_id:
                out.append(f'        <bpmn:flowNodeRef>{b_id}</bpmn:flowNodeRef>')
        out.append('      </bpmn:lane>')
    boundaries = model.get("boundaries", [])
    lane_of = {n[0]: n[2] for n in model["nodes"]}
    out.append('    </bpmn:laneSet>')
    for node_id, kind, _, _, label in model["nodes"]:
        tag = TAGS[kind]
        out.append(f'    <bpmn:{tag} id="{node_id}" name="{escape(label)}">')
        out += [f'      <bpmn:incoming>{f}</bpmn:incoming>' for f in incoming.get(node_id, [])]
        out += [f'      <bpmn:outgoing>{f}</bpmn:outgoing>' for f in outgoing.get(node_id, [])]
        if kind == "messageStart":
            out.append(f'      <bpmn:messageEventDefinition id="Msg_{node_id}" />')
        out.append(f'    </bpmn:{tag}>')
    for b_id, host, interrupting, label, expr in boundaries:
        cancel = "true" if interrupting else "false"
        out.append(f'    <bpmn:boundaryEvent id="{b_id}" name="{escape(label)}" attachedToRef="{host}" cancelActivity="{cancel}">')
        out += [f'      <bpmn:outgoing>{f}</bpmn:outgoing>' for f in outgoing.get(b_id, [])]
        out.append(f'      <bpmn:timerEventDefinition id="Timer_{b_id}">')
        out.append(f'        <bpmn:timeDuration xsi:type="bpmn:tFormalExpression">{escape(expr)}</bpmn:timeDuration>')
        out.append('      </bpmn:timerEventDefinition>')
        out.append('    </bpmn:boundaryEvent>')
    for i, (s, t, label, *_) in enumerate(model["flows"]):
        name = f' name="{escape(label)}"' if label else ""
        out.append(f'    <bpmn:sequenceFlow id="Flow_{i}"{name} sourceRef="{s}" targetRef="{t}" />')
    out.append('  </bpmn:process>')
    out.append(f'  <bpmndi:BPMNDiagram id="Diagram_{model["id"]}">')
    out.append(f'    <bpmndi:BPMNPlane id="Plane_{model["id"]}" bpmnElement="Collab_{model["id"]}">')
    out.append(f'      <bpmndi:BPMNShape id="Pool_{model["id"]}_di" bpmnElement="Pool_{model["id"]}" isHorizontal="true">')
    out.append(f'        <dc:Bounds x="0" y="0" width="{width}" height="{height}" />')
    out.append('      </bpmndi:BPMNShape>')
    for i, (lane_id, _) in enumerate(model["lanes"]):
        out.append(f'      <bpmndi:BPMNShape id="Lane_{lane_id}_di" bpmnElement="Lane_{lane_id}" isHorizontal="true">')
        out.append(f'        <dc:Bounds x="{HEADER_W}" y="{i * LANE_H}" width="{width - HEADER_W}" height="{LANE_H}" />')
        out.append('      </bpmndi:BPMNShape>')
    for node_id, kind, _, _, _ in model["nodes"]:
        x, y, w, h = boxes[node_id]
        marker = ' isMarkerVisible="true"' if kind == "xor" else ""
        out.append(f'      <bpmndi:BPMNShape id="{node_id}_di" bpmnElement="{node_id}"{marker}>')
        out.append(f'        <dc:Bounds x="{x:.0f}" y="{y:.0f}" width="{w}" height="{h}" />')
        out.append('      </bpmndi:BPMNShape>')
    for b_id, *_ in boundaries:
        x, y, w, h = boxes[b_id]
        out.append(f'      <bpmndi:BPMNShape id="{b_id}_di" bpmnElement="{b_id}">')
        out.append(f'        <dc:Bounds x="{x:.0f}" y="{y:.0f}" width="{w}" height="{h}" />')
        out.append('      </bpmndi:BPMNShape>')
    for i, (s, t, *rest) in enumerate(model["flows"]):
        out.append(f'      <bpmndi:BPMNEdge id="Flow_{i}_di" bpmnElement="Flow_{i}">')
        out += [f'        <di:waypoint x="{x:.0f}" y="{y:.0f}" />' for x, y in waypoints(boxes[s], boxes[t], *rest[1:])]
        out.append('      </bpmndi:BPMNEdge>')
    out += ['    </bpmndi:BPMNPlane>', '  </bpmndi:BPMNDiagram>', '</bpmn:definitions>', '']
    return "\n".join(out)


def wrap(label: str, width: int = 16) -> list[str]:
    words, lines, line = label.split(), [], ""
    for word in words:
        if len(line) + len(word) + 1 > width and line:
            lines.append(line)
            line = word
        else:
            line = f"{line} {word}".strip()
    return lines + [line]


def svg(model: dict, boxes: dict) -> str:
    width = HEADER_W + LEFT_PAD * 2 + (max(c for *_, c, _ in model["nodes"]) + 1) * COL_W + 40
    height = LANE_H * len(model["lanes"])
    o = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 {width + 2} {height + 2}" width="{width + 2}" height="{height + 2}" '
         f'role="img" aria-label="{escape(model["name"])}" font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif" font-size="12">',
         '<defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">'
         '<path d="M0,0 L10,5 L0,10 z" fill="#3b4652"/></marker></defs>',
         f'<rect x="0" y="0" width="{width}" height="{height}" fill="#ffffff" stroke="#3b4652"/>']
    for i, (_, lane_name) in enumerate(model["lanes"]):
        y = i * LANE_H
        fill = "#f4f6f9" if i % 2 else "#ffffff"
        o.append(f'<rect x="{HEADER_W}" y="{y}" width="{width - HEADER_W}" height="{LANE_H}" fill="{fill}" stroke="#c9d1db"/>')
        o.append(f'<text transform="translate({HEADER_W / 2 + 4},{y + LANE_H / 2}) rotate(-90)" text-anchor="middle" font-weight="600" fill="#1b2430">{escape(lane_name)}</text>')
    o.append(f'<line x1="{HEADER_W}" y1="0" x2="{HEADER_W}" y2="{height}" stroke="#3b4652"/>')
    for i, (s, t, label, *route) in enumerate(model["flows"]):
        pts = waypoints(boxes[s], boxes[t], *route)
        d = " ".join(f"{'M' if j == 0 else 'L'}{x:.0f},{y:.0f}" for j, (x, y) in enumerate(pts))
        o.append(f'<path d="{d}" fill="none" stroke="#3b4652" stroke-width="1.3" marker-end="url(#arrow)"/>')
        if label:
            # label the last segment, where the flow enters its target — or, for a straight flow out of a gateway, its start
            (x1, y1), (x2, y2) = pts[-2], pts[-1]
            source_kind = {n[0]: n[1] for n in model["nodes"]}.get(s)
            if len(pts) == 2 and abs(y1 - y2) < 1 and source_kind == "xor" and x2 > x1:
                o.append(f'<text x="{x1 + 6:.0f}" y="{y1 - 6:.0f}" font-size="11" fill="#5b6675">{escape(label)}</text>')
            elif abs(y1 - y2) < 1:  # horizontal into the target: right-align just before it
                o.append(f'<text x="{x2 - 6:.0f}" y="{y2 - 6:.0f}" text-anchor="end" font-size="11" fill="#5b6675">{escape(label)}</text>')
            else:
                o.append(f'<text x="{x1 + 5:.0f}" y="{(y1 + y2) / 2:.0f}" font-size="11" fill="#5b6675">{escape(label)}</text>')
    marks = {**{k: ("#a3312a", v) for k, v in model.get("pain", {}).items()}, **{k: ("#1e7b4f", v) for k, v in model.get("fixes", {}).items()}}
    for node_id, kind, _, _, label in model["nodes"]:
        x, y, w, h = boxes[node_id]
        cx, cy = x + w / 2, y + h / 2
        if kind in ("messageStart", "start", "end"):
            sw = 3 if kind == "end" else 1.5
            o.append(f'<circle cx="{cx:.0f}" cy="{cy:.0f}" r="{EVENT / 2}" fill="#fff" stroke="#1b2430" stroke-width="{sw}"/>')
            if kind == "messageStart":
                o.append(f'<rect x="{cx - 8:.0f}" y="{cy - 5:.0f}" width="16" height="11" fill="none" stroke="#1b2430"/>'
                         f'<path d="M{cx - 8:.0f},{cy - 5:.0f} L{cx:.0f},{cy + 1:.0f} L{cx + 8:.0f},{cy - 5:.0f}" fill="none" stroke="#1b2430"/>')
            for j, line in enumerate(wrap(label, 18)):
                if kind == "end":  # label to the right, clear of incoming flows
                    o.append(f'<text x="{x + w + 6:.0f}" y="{cy - 2 + j * 13:.0f}" fill="#1b2430">{escape(line)}</text>')
                else:
                    o.append(f'<text x="{cx:.0f}" y="{y + h + 14 + j * 13:.0f}" text-anchor="middle" fill="#1b2430">{escape(line)}</text>')
        elif kind == "xor":
            o.append(f'<path d="M{cx:.0f},{y:.0f} L{x + w:.0f},{cy:.0f} L{cx:.0f},{y + h:.0f} L{x:.0f},{cy:.0f} z" fill="#fff" stroke="#1b2430" stroke-width="1.5"/>')
            o.append(f'<path d="M{cx - 8:.0f},{cy - 8:.0f} L{cx + 8:.0f},{cy + 8:.0f} M{cx + 8:.0f},{cy - 8:.0f} L{cx - 8:.0f},{cy + 8:.0f}" stroke="#1b2430" stroke-width="2.5"/>')
            lines = wrap(label, 18)  # top-left of the diamond: flows leave from the top and bottom
            for j, line in enumerate(lines):
                o.append(f'<text x="{cx - 8:.0f}" y="{y - 2 - (len(lines) - 1 - j) * 13:.0f}" text-anchor="end" fill="#1b2430">{escape(line)}</text>')
        else:
            o.append(f'<rect x="{x:.0f}" y="{y:.0f}" width="{w}" height="{h}" rx="9" fill="#fff" stroke="#1b2430" stroke-width="1.5"/>')
            icon = {"userTask": "user", "serviceTask": "service", "sendTask": "send"}.get(kind)
            if icon:
                o.append(f'<text x="{x + 6:.0f}" y="{y + 13:.0f}" font-size="9" fill="#5b6675">{icon}</text>')
            lines = wrap(label, 17)
            for j, line in enumerate(lines):
                o.append(f'<text x="{cx:.0f}" y="{cy + 4 + (j - (len(lines) - 1) / 2) * 14:.0f}" text-anchor="middle" fill="#1b2430">{escape(line)}</text>')
        if node_id in marks:
            colour, text = marks[node_id]
            bw = 8 + 7 * len(text)
            o.append(f'<rect x="{x + w - bw / 2:.0f}" y="{y - 9:.0f}" width="{bw}" height="16" rx="8" fill="{colour}"/>'
                     f'<text x="{x + w:.0f}" y="{y + 3:.0f}" text-anchor="middle" font-size="10" font-weight="700" fill="#fff">{escape(text)}</text>')
    for b_id, _, interrupting, label, _ in model.get("boundaries", []):
        x, y, w, h = boxes[b_id]
        cx, cy, r = x + w / 2, y + h / 2, EVENT / 2
        dash = "" if interrupting else ' stroke-dasharray="4 3"'
        o.append(f'<circle cx="{cx:.0f}" cy="{cy:.0f}" r="{r}" fill="#fff" stroke="#1b2430" stroke-width="1.5"{dash}/>'
                 f'<circle cx="{cx:.0f}" cy="{cy:.0f}" r="{r - 4}" fill="none" stroke="#1b2430" stroke-width="1.2"{dash}/>'
                 f'<circle cx="{cx:.0f}" cy="{cy:.0f}" r="{r - 8}" fill="none" stroke="#1b2430"/>'
                 f'<path d="M{cx:.0f},{cy:.0f} L{cx:.0f},{cy - 7:.0f} M{cx:.0f},{cy:.0f} L{cx + 5:.0f},{cy + 2:.0f}" stroke="#1b2430" stroke-width="1.4"/>')
        lines = wrap(label, 14)  # above the host's top edge, left of the event, clear of the flows
        for j, line in enumerate(lines):
            o.append(f'<text x="{x - 4:.0f}" y="{cy - 4 - (len(lines) - 1 - j) * 12:.0f}" text-anchor="end" font-size="10.5" fill="#5b6675">{escape(line)}</text>')
    o.append('</svg>')
    return "\n".join(o)


def main() -> None:
    for model in (AS_IS, TO_BE):
        boxes = layout(model)
        bpmn_path = ROOT / "docs/04-process/bpmn" / f"{model['id'].replace('_', '-')}.bpmn"
        svg_path = ROOT / "site/assets/bpmn" / f"{model['id'].replace('_', '-')}.svg"
        bpmn_path.parent.mkdir(parents=True, exist_ok=True)
        svg_path.parent.mkdir(parents=True, exist_ok=True)
        bpmn_path.write_text(bpmn_xml(model, boxes), encoding="utf-8")
        svg_path.write_text(svg(model, boxes), encoding="utf-8")
        print(f"wrote {bpmn_path.relative_to(ROOT)} and {svg_path.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
