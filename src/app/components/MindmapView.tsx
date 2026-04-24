"use client";

import { useState, useCallback } from "react";
import ReactFlow, {
  Node, Edge, Background, Controls, MiniMap,
  BackgroundVariant, NodeMouseHandler,
} from "react-flow-renderer";
import { X } from "lucide-react";
import { ActionBar, CopyButton, DownloadButton } from "./ActionButtons";

interface MindmapViewProps {
  summary: string;
  keyPoints: string[];
  explanation: string;
}

interface PopupData {
  title: string;
  detail: string;
}

function truncate(str: string, max = 48): string {
  return str.length > max ? str.slice(0, max).trimEnd() + "…" : str;
}

// Find the explanation sentence most relevant to a key point using keyword overlap
function findRelatedSentence(keyPoint: string, explanation: string): string {
  const sentences = explanation
    .split(/(?<=[.!?])\s+/)
    .filter((s) => s.trim().length > 20);

  if (sentences.length === 0) return explanation.slice(0, 200) + "…";

  const keywords = keyPoint
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3);

  let bestScore = -1;
  let bestSentence = sentences[0];

  for (const sentence of sentences) {
    const lower = sentence.toLowerCase();
    const score = keywords.filter((kw) => lower.includes(kw)).length;
    if (score > bestScore) {
      bestScore = score;
      bestSentence = sentence;
    }
  }

  return bestScore > 0
    ? bestSentence
    : explanation.slice(0, 220).trimEnd() + "…";
}

function buildGraph(
  summary: string,
  keyPoints: string[],
  selectedId: string | null
): { nodes: Node[]; edges: Edge[] } {
  const centerX = 500;
  const centerY = 300;
  const radius = 240;
  const count = keyPoints.length;

  const centerNode: Node = {
    id: "center",
    type: "default",
    position: { x: centerX - 100, y: centerY - 40 },
    data: { label: truncate(summary, 60) },
    style: {
      background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
      color: "#fff",
      border: "none",
      borderRadius: "16px",
      padding: "14px 20px",
      fontWeight: "700",
      fontSize: "13px",
      width: 200,
      textAlign: "center" as const,
      boxShadow: "0 4px 24px rgba(99,102,241,0.35)",
      lineHeight: "1.5",
    },
  };

  const nodes: Node[] = [centerNode];
  const edges: Edge[] = [];

  keyPoints.forEach((point, i) => {
    const angle = (2 * Math.PI * i) / count - Math.PI / 2;
    const x = centerX + radius * Math.cos(angle) - 110;
    const y = centerY + radius * Math.sin(angle) - 36;
    const nodeId = `kp-${i}`;
    const isSelected = selectedId === nodeId;

    nodes.push({
      id: nodeId,
      type: "default",
      position: { x, y },
      data: { label: truncate(point, 52) },
      style: {
        background: isSelected ? "#eef2ff" : "#ffffff",
        border: isSelected ? "2px solid #6366f1" : "1.5px solid #e2e8f0",
        borderRadius: "12px",
        padding: "10px 14px",
        fontSize: "12px",
        fontWeight: isSelected ? "700" : "500",
        color: isSelected ? "#4338ca" : "#334155",
        width: 220,
        textAlign: "center" as const,
        boxShadow: isSelected
          ? "0 0 0 3px rgba(99,102,241,0.25), 0 2px 10px rgba(0,0,0,0.08)"
          : "0 2px 10px rgba(0,0,0,0.06)",
        lineHeight: "1.5",
        cursor: "pointer",
        transition: "all 0.15s ease",
      },
    });

    edges.push({
      id: `e-center-${nodeId}`,
      source: "center",
      target: nodeId,
      style: {
        stroke: isSelected ? "#818cf8" : "#c7d2fe",
        strokeWidth: isSelected ? 2.5 : 2,
      },
      animated: false,
    });
  });

  return { nodes, edges };
}

export default function MindmapView({ summary, keyPoints, explanation }: MindmapViewProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [popup, setPopup] = useState<PopupData | null>(null);

  const handleNodeClick: NodeMouseHandler = useCallback(
    (_event, node) => {
      // Center node — no popup
      if (node.id === "center") { setPopup(null); setSelectedId(null); return; }

      const idx = parseInt(node.id.replace("kp-", ""), 10);
      const keyPoint = keyPoints[idx];
      if (!keyPoint) return;

      // Toggle off if clicking the same node
      if (selectedId === node.id) {
        setSelectedId(null);
        setPopup(null);
        return;
      }

      setSelectedId(node.id);
      setPopup({
        title: keyPoint,
        detail: findRelatedSentence(keyPoint, explanation),
      });
    },
    [keyPoints, explanation, selectedId]
  );

  const closePopup = () => { setPopup(null); setSelectedId(null); };

  const { nodes, edges } = buildGraph(summary, keyPoints, selectedId);

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-2 px-6 py-4 border-b border-slate-100 bg-slate-50/60">
        <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12" />
        </svg>
        <span className="text-sm font-semibold text-slate-700">Concept Mindmap</span>
        <span className="text-xs text-slate-400">
          {keyPoints.length} key points · click a node to explore
        </span>
        <div className="ml-auto">
          <ActionBar>
            <CopyButton
              label="Copy Mindmap"
              getText={() => keyPoints.map((pt, i) => `${i + 1}. ${pt}`).join("\n")}
            />
            <DownloadButton
              label="Download Mindmap"
              filename="mindmap.txt"
              getContent={() => [
                "=== MINDMAP — KEY POINTS ===",
                keyPoints.map((pt, i) => `${i + 1}. ${pt}`).join("\n"),
              ].join("\n")}
            />
          </ActionBar>
        </div>
      </div>

      {/* Flow canvas — relative so popup can be positioned inside */}
      <div style={{ height: 540 }} className="relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodeClick={handleNodeClick}
          onPaneClick={closePopup}
          fitView
          fitViewOptions={{ padding: 0.25 }}
          nodesDraggable
          nodesConnectable={false}
          elementsSelectable={false}
          zoomOnDoubleClick={false}
          attributionPosition="bottom-right"
        >
          <Background variant={BackgroundVariant.Dots} gap={18} size={1} color="#e2e8f0" />
          <Controls showInteractive={false} />
          <MiniMap
            nodeColor={(n) => (n.id === selectedId ? "#6366f1" : "#818cf8")}
            maskColor="rgba(248,250,252,0.7)"
            style={{ borderRadius: 8, border: "1px solid #e2e8f0" }}
          />
        </ReactFlow>

        {/* Popup card — overlaid inside the canvas */}
        {popup && (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-50 w-[min(480px,90%)] bg-white rounded-2xl border border-indigo-100 shadow-xl p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0 mt-0.5" />
                <h3 className="text-sm font-bold text-slate-800 leading-snug">{popup.title}</h3>
              </div>
              <button
                type="button"
                onClick={closePopup}
                className="shrink-0 text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed border-l-2 border-indigo-200 pl-3">
              {popup.detail}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
