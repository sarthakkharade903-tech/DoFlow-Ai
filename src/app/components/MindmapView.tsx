"use client";

import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
} from "react-flow-renderer";

interface MindmapViewProps {
  summary: string;
  keyPoints: string[];
}

// Truncate long labels for the node display
function truncate(str: string, max = 48): string {
  return str.length > max ? str.slice(0, max).trimEnd() + "…" : str;
}

// Build nodes + edges with a simple radial layout
function buildGraph(
  summary: string,
  keyPoints: string[]
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

    nodes.push({
      id: nodeId,
      type: "default",
      position: { x, y },
      data: { label: truncate(point, 52) },
      style: {
        background: "#ffffff",
        border: "1.5px solid #e2e8f0",
        borderRadius: "12px",
        padding: "10px 14px",
        fontSize: "12px",
        fontWeight: "500",
        color: "#334155",
        width: 220,
        textAlign: "center" as const,
        boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
        lineHeight: "1.5",
      },
    });

    edges.push({
      id: `e-center-${nodeId}`,
      source: "center",
      target: nodeId,
      style: { stroke: "#c7d2fe", strokeWidth: 2 },
      animated: false,
    });
  });

  return { nodes, edges };
}

export default function MindmapView({ summary, keyPoints }: MindmapViewProps) {
  const { nodes, edges } = buildGraph(summary, keyPoints);

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-100 bg-slate-50/60">
        <svg
          className="w-4 h-4 text-indigo-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12" />
        </svg>
        <span className="text-sm font-semibold text-slate-700">Concept Mindmap</span>
        <span className="ml-auto text-xs text-slate-400">{keyPoints.length} key points · drag to explore</span>
      </div>

      {/* Flow canvas */}
      <div style={{ height: 540 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          fitViewOptions={{ padding: 0.25 }}
          nodesDraggable
          nodesConnectable={false}
          elementsSelectable={false}
          zoomOnDoubleClick={false}
          attributionPosition="bottom-right"
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={18}
            size={1}
            color="#e2e8f0"
          />
          <Controls showInteractive={false} />
          <MiniMap
            nodeColor={() => "#818cf8"}
            maskColor="rgba(248,250,252,0.7)"
            style={{ borderRadius: 8, border: "1px solid #e2e8f0" }}
          />
        </ReactFlow>
      </div>
    </div>
  );
}
