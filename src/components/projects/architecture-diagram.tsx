"use client";

import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { useId, useState } from "react";
import { tr, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/cn";
import { diagrams, type DiagramEdge, type DiagramNode } from "./diagrams";

const NODE_W = 170;
const NODE_H = 60;
const STEP_SECONDS = 0.9;

function edgePath(edge: DiagramEdge, nodes: Map<string, DiagramNode>) {
  const a = nodes.get(edge.from);
  const b = nodes.get(edge.to);
  if (!a || !b) return { d: "", mid: { x: 0, y: 0 } };
  // Quadratic curve; `bend` pushes the control point sideways so two-way pairs don't overlap.
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const bend = edge.bend ?? 0;
  const cx = mx + (-dy / len) * bend * 2;
  const cy = my + (dx / len) * bend * 2;
  return { d: `M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`, mid: { x: (mx + cx) / 2, y: (my + cy) / 2 } };
}

/**
 * Interactive system diagram: pick a scenario and its data path lights up, with packets
 * travelling along each hop in order (SVG SMIL — no JS animation loop). The ordered step list
 * below is the accessible description of the same flow.
 */
export function ArchitectureDiagram({ id, locale, hint }: { id: keyof typeof diagrams; locale: Locale; hint: string }) {
  const diagram = diagrams[id];
  const [active, setActive] = useState(diagram.scenarios[0]?.id ?? "");
  const reduce = useReducedMotion();
  const uid = useId().replace(/:/g, "");
  const scenario = diagram.scenarios.find((s) => s.id === active) ?? diagram.scenarios[0];
  const nodes = new Map(diagram.nodes.map((n) => [n.id, n]));
  const activeEdges = new Set(scenario?.path ?? []);
  const activeNodes = new Set((scenario?.path ?? []).flatMap((eid) => {
    const e = diagram.edges.find((x) => x.id === eid);
    return e ? [e.from, e.to] : [];
  }));

  return (
    <div className="surface overflow-hidden">
      <div role="tablist" aria-label={hint} className="flex gap-1 overflow-x-auto border-b border-line p-2 scrollbar-none">
        {diagram.scenarios.map((s) => (
          <button
            key={s.id}
            role="tab"
            type="button"
            aria-selected={s.id === active}
            aria-controls={`${uid}-panel`}
            onClick={() => setActive(s.id)}
            className={cn(
              "relative shrink-0 rounded-full px-4 py-2 text-sm transition-colors",
              s.id === active ? "text-fg" : "text-muted hover:text-fg",
            )}
          >
            {s.id === active && <m.span layoutId={`${uid}-tab`} className="absolute inset-0 rounded-full bg-sunken" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
            <span className="relative">{tr(s.title, locale)}</span>
          </button>
        ))}
      </div>

      <div id={`${uid}-panel`} role="tabpanel" className="grid lg:grid-cols-[1fr_18rem]">
        <div className="overflow-x-auto p-3 sm:p-6" dir="ltr">
          <svg key={scenario?.id} viewBox={`0 0 ${diagram.width} ${diagram.height}`} className="h-auto w-full min-w-[640px]" aria-hidden="true">
            <defs>
              <pattern id={`${uid}-grid`} width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" fill="var(--grid-dot)" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#${uid}-grid)`} />

            {diagram.edges.map((edge) => {
              const { d, mid } = edgePath(edge, nodes);
              const on = activeEdges.has(edge.id);
              const tone = nodes.get(edge.to)?.tone ?? "mint";
              return (
                <g key={edge.id} data-tone={tone}>
                  <path id={`${uid}-${edge.id}`} d={d} fill="none" stroke={on ? "var(--tone)" : "var(--line-strong)"} strokeWidth={on ? 2 : 1} strokeDasharray={on ? "6 6" : "3 5"} className="transition-[stroke] duration-500">
                    {on && !reduce && <animate attributeName="stroke-dashoffset" from="24" to="0" dur="0.8s" repeatCount="indefinite" />}
                  </path>
                  <text x={mid.x} y={mid.y - 6} textAnchor="middle" className={cn("font-mono text-[10px] transition-opacity duration-500", on ? "fill-[var(--fg)] opacity-100" : "fill-[var(--fg-subtle)] opacity-0")}>
                    {edge.label}
                  </text>
                </g>
              );
            })}

            {/* Packets: re-keyed per scenario so the sequence restarts from the first hop. */}
            {!reduce &&
              scenario?.path.map((eid, i) => {
                const tone = nodes.get(diagram.edges.find((e) => e.id === eid)?.to ?? "")?.tone ?? "mint";
                return (
                  <circle key={`${scenario.id}-${eid}-${i}`} r="5" data-tone={tone} fill="var(--tone)" opacity="0">
                    <animateMotion dur={`${STEP_SECONDS}s`} begin={`${i * STEP_SECONDS};${uid}-loop.end+${i * STEP_SECONDS}`} fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1" keyTimes="0;1">
                      <mpath href={`#${uid}-${eid}`} />
                    </animateMotion>
                    <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.85;1" dur={`${STEP_SECONDS}s`} begin={`${i * STEP_SECONDS};${uid}-loop.end+${i * STEP_SECONDS}`} fill="freeze" />
                  </circle>
                );
              })}
            {!reduce && scenario && (
              <rect key={`${scenario.id}-loop`} width="0" height="0">
                <animate id={`${uid}-loop`} attributeName="width" from="0" to="0" dur={`${scenario.path.length * STEP_SECONDS + 1.2}s`} begin={`0;${uid}-loop.end`} />
              </rect>
            )}

            {diagram.nodes.map((node) => {
              const on = activeNodes.has(node.id);
              return (
                <g key={node.id} data-tone={node.tone} transform={`translate(${node.x - NODE_W / 2} ${node.y - NODE_H / 2})`}>
                  <rect width={NODE_W} height={NODE_H} rx="14" fill="var(--bg-raised)" stroke={on ? "var(--tone)" : "var(--line)"} strokeWidth={on ? 1.5 : 1} className="transition-[stroke] duration-500" />
                  <rect x="12" y="14" width="6" height="6" rx="3" fill={on ? "var(--tone)" : "var(--line-strong)"} className="transition-[fill] duration-500" />
                  <text x="26" y="24" className="fill-[var(--fg)] text-[13px] font-semibold" style={{ fontFamily: "var(--font-sans)" }}>
                    {node.label}
                  </text>
                  <text x="26" y="43" className="fill-[var(--fg-subtle)] font-mono text-[10.5px]">
                    {node.sub}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="border-t border-line p-5 lg:border-s lg:border-t-0">
          <AnimatePresence mode="wait" initial={false}>
            <m.ol
              key={scenario?.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-4"
            >
              {scenario?.steps.map((step, i) => (
                <li key={i} className="grid grid-cols-[1.75rem_1fr] gap-2 text-sm">
                  <span className="grid size-6 place-items-center rounded-full border border-line font-mono text-[0.7rem] text-subtle" dir="ltr">
                    {i + 1}
                  </span>
                  <span className="text-muted">{tr(step, locale)}</span>
                </li>
              ))}
            </m.ol>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
