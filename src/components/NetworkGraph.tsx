/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { UserNode, LayoutNode, GraphConfig } from "../types";
import { 
  Plus, 
  Minus, 
  RotateCcw, 
  Target, 
  Search,
  User, 
  Sparkles,
  TrendingUp,
  Award,
  ChevronRight,
  HelpCircle
} from "lucide-react";

interface NetworkGraphProps {
  rootNode: UserNode;
  selectedNode: UserNode | null;
  onSelectNode: (node: UserNode) => void;
  onCenterNode: (node: UserNode) => void;
  onResetCenter: () => void;
  historyStack: UserNode[];
  onPopHistory: () => void;
}

export default function NetworkGraph({
  rootNode,
  selectedNode,
  onSelectNode,
  onCenterNode,
  onResetCenter,
  historyStack,
  onPopHistory,
}: NetworkGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Zoom & Pan state
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(0.85);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  // Hovered node state for tooltip
  const [hoverNode, setHoverNode] = useState<LayoutNode | null>(null);

  // Track images that fail to load
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  // Calculate dynamic expansion parameters to prevent overcrowding
  const level1Nodes = rootNode.children || [];
  const N1 = level1Nodes.length;

  let maxL2ChildrenCount = 0;
  let maxL3ChildrenCount = 0;
  let maxL4ChildrenCount = 0;

  level1Nodes.forEach(n1 => {
    const l2Children = n1.children || [];
    maxL2ChildrenCount = Math.max(maxL2ChildrenCount, l2Children.length);
    l2Children.forEach(n2 => {
      const l3Children = n2.children || [];
      maxL3ChildrenCount = Math.max(maxL3ChildrenCount, l3Children.length);
      l3Children.forEach(n3 => {
        const l4Children = n3.children || [];
        maxL4ChildrenCount = Math.max(maxL4ChildrenCount, l4Children.length);
      });
    });
  });

  const ring1Extra = Math.min(45, N1 > 4 ? (N1 - 4) * 8 : (N1 <= 2 ? -20 : 0));
  const ring2Extra = Math.min(60, maxL2ChildrenCount > 2 ? (maxL2ChildrenCount - 2) * 10 : 0);
  const ring3Extra = Math.min(80, maxL3ChildrenCount > 2 ? (maxL3ChildrenCount - 2) * 12 : 0);
  const ring4Extra = Math.min(100, maxL4ChildrenCount > 2 ? (maxL4ChildrenCount - 2) * 15 : 0);

  // Graph styling dimensions configuration for 4 concentric levels
  const config: GraphConfig = {
    ring1Radius: 115 + ring1Extra,
    ring2Radius: 215 + ring1Extra + ring2Extra,
    ring3Radius: 315 + ring1Extra + ring2Extra + ring3Extra,
    ring4Radius: 415 + ring1Extra + ring2Extra + ring3Extra + ring4Extra,
    nodeSizeLevel0: 80,
    nodeSizeLevel1: 58,
    nodeSizeLevel2: 44,
    nodeSizeLevel3: 40,
    nodeSizeLevel4: 32,
  };

  function layoutRadialTree(root: UserNode): LayoutNode[] {
    const layoutNodes: LayoutNode[] = [];

    // Configuration for Orbits and Node sizes
    const ring1Radius = config.ring1Radius;
    const ring2Radius = config.ring2Radius;
    const ring3Radius = config.ring3Radius;
    const ring4Radius = config.ring4Radius;

    const size0 = config.nodeSizeLevel0 / 2;
    const size1 = config.nodeSizeLevel1 / 2;
    const size2 = config.nodeSizeLevel2 / 2;
    const size3 = config.nodeSizeLevel3 / 2;
    const size4 = config.nodeSizeLevel4 / 2;

    // 1. Root Node (Level 0)
    layoutNodes.push({
      node: root,
      x: 0,
      y: 0,
      angle: -Math.PI / 2,
      radius: 0,
      level: 0,
      parentX: null,
      parentY: null,
      nodeRadius: size0
    });

    // 2. Position Level 1 Nodes
    const level1Nodes = root.children || [];
    const N1 = level1Nodes.length;

    if (N1 > 0) {
      const W1 = (2 * Math.PI) / N1; // Sector width for each Level 1 node
      
      level1Nodes.forEach((nodeL1, idxL1) => {
        const angleL1 = -Math.PI / 2 + idxL1 * W1; // Rule 1: start at 12 o'clock and distribute evenly
        const xL1 = Math.cos(angleL1) * ring1Radius;
        const yL1 = Math.sin(angleL1) * ring1Radius;

        layoutNodes.push({
          node: nodeL1,
          x: xL1,
          y: yL1,
          angle: angleL1,
          radius: ring1Radius,
          level: 1,
          parentX: 0,
          parentY: 0,
          nodeRadius: size1
        });

        // Recurse to Level 2
        const minL1Angle = angleL1 - W1 / 2 + 0.015;
        const maxL1Angle = angleL1 + W1 / 2 - 0.015;
        positionDescendants(nodeL1, angleL1, 1, xL1, yL1, minL1Angle, maxL1Angle);
      });
    }

    function getNodeWeight(node: UserNode): number {
      let count = 0;
      if (node.children) {
        count += node.children.length;
        node.children.forEach(c => {
          if (c.children) {
            count += c.children.length;
            c.children.forEach(gc => {
              if (gc.children) {
                count += gc.children.length;
              }
            });
          }
        });
      }
      return 1.5 + count;
    }

    // Recursive placement for Level 2, 3, 4
    function positionDescendants(
      parentNode: UserNode,
      parentAngle: number,
      parentLevel: number,
      parentX: number,
      parentY: number,
      minSectorAngle: number,
      maxSectorAngle: number
    ) {
      const currentLevel = parentLevel + 1;
      if (currentLevel > 4) return;

      const children = parentNode.children || [];
      const C = children.length;
      if (C === 0) return;

      // Select orbit and node size parameters
      let radius = ring2Radius;
      let stdRadius = size2;

      if (currentLevel === 3) {
        radius = ring3Radius;
        stdRadius = size3;
      } else if (currentLevel === 4) {
        radius = ring4Radius;
        stdRadius = size4;
      }

      // Calculate total weight of descendants to allocate sector width proportionally
      const weights = children.map(child => getNodeWeight(child));
      const totalWeight = weights.reduce((sum, w) => sum + w, 0);

      const parentSectorWidth = maxSectorAngle - minSectorAngle;

      // Dynamic spacing thresholds depending on Orbit Radius Level to prevent overlaps
      let minSeparationAngle = 0.28; // level 2 (approx 16 degrees)
      if (currentLevel === 3) {
        minSeparationAngle = 0.16;   // (approx 9 degrees)
      } else if (currentLevel === 4) {
        minSeparationAngle = 0.10;   // (approx 5.7 degrees)
      }

      // Calculate safe minimum sector bounds based on children count
      const minRequiredSector = (C - 1) * minSeparationAngle;

      let usedSectorWidth = 0;
      if (C > 1) {
        // High fidelity adaptive spacing: spread descendants across 85% of parent sector to fully utilize space
        let defaultSpread = parentSectorWidth * 0.85;
        
        // If Level 1 has only 1 node, or more generally when the parent sector space is extremely wide (> 270 degrees),
        // we shouldn't let sibling nodes fly apart to opposite ends of the circle. We cap the spread elegantly.
        if (N1 === 1 || parentSectorWidth > Math.PI * 1.5) {
          if (currentLevel === 2) {
            defaultSpread = Math.min(defaultSpread, 0.35 + (C - 1) * 0.42);
          } else if (currentLevel === 3) {
            defaultSpread = Math.min(defaultSpread, 0.22 + (C - 1) * 0.26);
          } else if (currentLevel === 4) {
            defaultSpread = Math.min(defaultSpread, 0.14 + (C - 1) * 0.16);
          }
        }
        
        // Ensure we satisfy the safe separation and cap it to 98% of the parent sector to avoid bleeding into neighbours
        usedSectorWidth = Math.max(minRequiredSector, defaultSpread);
        usedSectorWidth = Math.min(parentSectorWidth * 0.98, usedSectorWidth);
      } else {
        usedSectorWidth = 0;
      }

      // Center the children's sector exactly around the parent's angle for symmetry and harmony
      const cl_minAngle = parentAngle - usedSectorWidth / 2;
      const cl_maxAngle = parentAngle + usedSectorWidth / 2;

      let currentMinAngle = cl_minAngle;

      children.forEach((childNode, idx) => {
        const childWeight = weights[idx];
        
        let childSectorWidth = 0;
        let childMinAngle = minSectorAngle;
        let childMaxAngle = maxSectorAngle;

        if (C > 1) {
          // Robust blend to avoid single sub-branches getting squashed to zero.
          // Mix 50% uniform share and 50% weight-proportional share.
          const uniformShare = 1 / C;
          const weightShare = totalWeight > 0 ? (childWeight / totalWeight) : uniformShare;
          const blendedShare = 0.5 * uniformShare + 0.5 * weightShare;
          childSectorWidth = usedSectorWidth * blendedShare;

          childMinAngle = currentMinAngle;
          childMaxAngle = currentMinAngle + childSectorWidth;
          currentMinAngle = childMaxAngle;
        } else if (C === 1) {
          // Centered compact sector for only-child subtree to prevent downstream over-spreading
          if (currentLevel === 2) {
            childSectorWidth = Math.min(parentSectorWidth, Math.PI / 1.5);
          } else if (currentLevel === 3) {
            childSectorWidth = Math.min(parentSectorWidth, Math.PI / 2.5);
          } else {
            childSectorWidth = Math.min(parentSectorWidth, Math.PI / 4.0);
          }
          childMinAngle = parentAngle - childSectorWidth / 2;
          childMaxAngle = parentAngle + childSectorWidth / 2;
        }

        // Position at center of its allotted sub-sector
        const childAngle = C > 1 ? (childMinAngle + (childSectorWidth > 0 ? childSectorWidth / 2 : 0)) : parentAngle;
        const x = Math.cos(childAngle) * radius;
        const y = Math.sin(childAngle) * radius;

        // Calculate dynamic node radius to fit comfortably with adjacent siblings on the same orbit
        let nodeRadius = stdRadius;
        if (C > 1) {
          // Space available in this child's sector
          const spacingAngle = childSectorWidth;
          const physicalDistance = 2 * radius * Math.sin(spacingAngle / 2);
          const maxRadiusBySiblings = physicalDistance * 0.46; // safety margin
          const minAllowedSize = currentLevel === 2 ? 18 : (currentLevel === 3 ? 16 : 14);
          nodeRadius = Math.max(minAllowedSize, Math.min(stdRadius, maxRadiusBySiblings));
        }

        layoutNodes.push({
          node: childNode,
          x,
          y,
          angle: childAngle,
          radius,
          level: currentLevel,
          parentX,
          parentY,
          nodeRadius
        });

        // Recurse to place its descendants inside its proportional sector boundaries
        positionDescendants(
          childNode,
          childAngle,
          currentLevel,
          x,
          y,
          childMinAngle,
          childMaxAngle
        );
      });
    }

    return layoutNodes;
  }

  // Generate layouts based on current central root node
  const layout = layoutRadialTree(rootNode);

  // Dynamically calculate level statistics for the current circular view
  const countLevel1 = layout.filter(n => n.level === 1).length;
  const countLevel2 = layout.filter(n => n.level === 2).length;
  const countLevel3 = layout.filter(n => n.level === 3).length;
  const countLevel4 = layout.filter(n => n.level === 4).length;
  const countTotal = countLevel1 + countLevel2 + countLevel3 + countLevel4 + 1;

  // Calculates the center of the largest empty angle gap at a specific orbit level
  function getOrbitLabelPosition(level: number, radius: number) {
    const levelNodes = layout.filter(n => n.level === level);
    if (levelNodes.length === 0) {
      const defAngle = -Math.PI / 2 + (level - 1) * 0.15;
      return {
        x: Math.cos(defAngle) * radius,
        y: Math.sin(defAngle) * radius,
        angle: defAngle
      };
    }

    const angles = levelNodes.map(n => {
      let a = n.angle % (2 * Math.PI);
      if (a < 0) a += 2 * Math.PI;
      return a;
    }).sort((a, b) => a - b);

    let maxGap = 0;
    let gapStartAngle = 0;

    for (let i = 0; i < angles.length; i++) {
      const current = angles[i];
      const next = angles[(i + 1) % angles.length];
      let gap = next - current;
      if (gap < 0) gap += 2 * Math.PI;

      if (gap > maxGap) {
        maxGap = gap;
        gapStartAngle = current;
      }
    }

    const targetAngle = gapStartAngle + maxGap / 2;
    return {
      x: Math.cos(targetAngle) * radius,
      y: Math.sin(targetAngle) * radius,
      angle: targetAngle
    };
  }

  // Mouse wheel zoome event
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = 1.1;
    const nextScale = e.deltaY < 0 ? scale * zoomFactor : scale / zoomFactor;
    setScale(Math.max(0.15, Math.min(nextScale, 4.0)));
  };

  // Mouse Drag to Pan events
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as SVGElement).tagName === "svg" || (e.target as SVGElement).id === "bg-drag") {
      setIsDragging(true);
      dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile/iframe device compliance
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      dragStart.current = { x: e.touches[0].clientX - pan.x, y: e.touches[0].clientY - pan.y };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && e.touches.length === 1) {
      setPan({
        x: e.touches[0].clientX - dragStart.current.x,
        y: e.touches[0].clientY - dragStart.current.y,
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Re-center zoom & pan triggers
  const resetZoom = () => {
    setPan({ x: 0, y: 0 });
    setScale(0.85);
  };

  const zoomIn = () => {
    setScale(prev => Math.min(4.0, prev * 1.2));
  };

  const zoomOut = () => {
    setScale(prev => Math.max(0.15, prev / 1.2));
  };

  // Helper to determine size profile
  const getNodeRadius = (level: number) => {
    if (level === 0) return config.nodeSizeLevel0 / 2;
    if (level === 1) return config.nodeSizeLevel1 / 2;
    if (level === 2) return config.nodeSizeLevel2 / 2;
    return config.nodeSizeLevel3 / 2;
  };

  // Hover styles / glow themes according to the design reference
  const getGlowColor = (level: number) => {
    if (level === 0) return "#244fd4"; // Brand Primary
    if (level === 1) return "#2f73f3"; // Brand Secondary
    if (level === 2) return "#182bb6"; // Brand Tertiary
    return "rgba(47, 115, 243, 0.45)";
  };

  const getGlowShadow = (level: number) => {
    const color = getGlowColor(level);
    return `drop-shadow(0 0 10px ${color})`;
  };

  // Human reader for large volumes
  const formatVolume = (val: string) => {
    if (val === "0" || !val) return "0";
    if (val.length > 21) {
      // e.g. 10^21 = Septillions or similar, let's keep it tidy
      const numDigits = val.length - 18;
      return (parseFloat(val.slice(0, numDigits)) / 1000).toFixed(1) + "M W3H";
    }
    const valNum = parseFloat(val) / 1e18;
    if (valNum >= 1000) return (valNum / 1000).toFixed(1) + "K W3H";
    return valNum.toFixed(1) + " W3H";
  };

  return (
    <div 
      className="relative w-full h-full bg-brand-bg rounded-brand-global overflow-hidden border border-brand-primary/20 shadow-2xl select-none"
      ref={containerRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Dynamic Cosmic Background with Nebulous glowing blobs */}
      <div className="absolute inset-0 z-0 bg-brand-bg pointer-events-none" />
      
      {/* Perspective Grid Mesh */}
      <div 
        className="absolute bottom-0 left-0 w-full h-[150px] opacity-[0.06] pointer-events-none z-0" 
        style={{ 
          backgroundImage: "linear-gradient(0deg, #244fd4 1px, transparent 1px), linear-gradient(90deg, #244fd4 1px, transparent 1px)", 
          backgroundSize: "20px 20px", 
          transform: "perspective(400px) rotateX(60deg)",
          transformOrigin: "bottom center"
        }} 
      />

      {/* Cyber ambient particle lights using brand primary/secondary with blur */}
      <div className="absolute top-[20%] left-[30%] w-[250px] h-[250px] rounded-full bg-brand-primary/5 blur-[90px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[30%] w-[250px] h-[250px] rounded-full bg-brand-secondary/3 blur-[90px] pointer-events-none" />

      {/* 1. Interactive Instructions Card (English) - global radius 20px, inner containers using rgba(0,0,0,0.2) */}
      <div className="absolute top-6 left-6 z-10 flex flex-col gap-2.5 p-4 bg-brand-card/95 backdrop-blur-xl border border-brand-primary/30 rounded-brand-global shadow-lg w-[285px] text-left font-sans">
        <div className="flex items-center justify-between border-b border-brand-primary/20 pb-2 mb-1">
          <HelpCircle size={15} className="text-brand-secondary" strokeWidth={2} />
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-secondary animate-pulse shadow-[0_0_8px_#2f73f3]" />
            <span className="text-white text-[11px] font-bold uppercase tracking-wider">Solar Grid Interactions</span>
          </div>
        </div>
        
        <div className="flex flex-col gap-2.5 text-[10px] text-gray-300 leading-relaxed font-mono uppercase font-semibold">
          <div className="flex items-start justify-start gap-2 text-left">
            <div className="min-w-[15px] h-4 bg-brand-inner text-brand-secondary border border-brand-primary/10 rounded-md flex items-center justify-center font-bold text-[9px] mt-0.5 font-mono">1</div>
            <div className="flex flex-col flex-1">
              <strong className="text-brand-secondary">Single Click Profile:</strong>
              <span className="text-gray-400 text-[9px] mt-0.5 normal-case font-sans font-normal">Displays detailed telemetry and metrics inside the right sidebar.</span>
            </div>
          </div>
          
          <div className="flex items-start justify-start gap-2 text-left">
            <div className="min-w-[15px] h-4 bg-brand-inner text-brand-secondary border border-brand-primary/10 rounded-md flex items-center justify-center font-bold text-[9px] mt-0.5 font-mono">2</div>
            <div className="flex flex-col flex-1">
              <strong className="text-brand-secondary">Double Click Node:</strong>
              <span className="text-gray-400 text-[9px] mt-0.5 normal-case font-sans font-normal">Travel deeper to set node as root center and load sub-networks.</span>
            </div>
          </div>

          <div className="flex items-start justify-start gap-2 text-left">
            <div className="min-w-[15px] h-4 bg-brand-inner text-brand-secondary border border-brand-primary/10 rounded-md flex items-center justify-center font-bold text-[9px] mt-0.5 font-mono">3</div>
            <div className="flex flex-col flex-1">
              <strong className="text-brand-secondary">Hover Overview:</strong>
              <span className="text-gray-400 text-[9px] mt-0.5 normal-case font-sans font-normal">Triggers quick data pop-up indicating team volume and counts.</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Top-Right Hierarchy Legend - Global Radius 20px, brand card background */}
      <div className="absolute top-6 right-6 z-10 hidden sm:flex flex-col gap-2 p-3 bg-brand-card/95 backdrop-blur-xl border border-brand-primary/25 rounded-brand-global text-[10px] font-mono uppercase tracking-wider">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full border border-brand-primary shadow-[0_0_8px_rgba(36,79,212,0.8)] bg-brand-primary" />
          <span className="text-[#e2e8f0] font-medium select-none">You (Root)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full border border-brand-secondary/85 bg-brand-secondary/80" />
          <span className="text-gray-400 font-medium select-none">Level 1</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full border border-brand-tertiary/85 bg-brand-tertiary" />
          <span className="text-gray-400 font-medium select-none">Level 2</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full border border-brand-tertiary/45 bg-brand-tertiary/30" />
          <span className="text-gray-400 font-medium select-none">Level 3</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full border border-brand-inner/60 bg-brand-inner" />
          <span className="text-gray-400 font-medium select-none">Level 4</span>
        </div>
      </div>

      {/* 3. Bottom-Left Network Population breakdown - Global Radius 20px, brand card bg */}
      <div className="absolute bottom-6 left-6 z-10 flex flex-col gap-1.5 p-4 bg-brand-card/95 backdrop-blur-xl border border-brand-primary/20 rounded-brand-global w-[170px] font-mono text-[10px] uppercase tracking-wider shadow-lg pointer-events-none">
        <div className="flex items-center justify-between text-brand-secondary border-b border-brand-primary/10 pb-1 mr-0.5">
          <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />L1 POP:</span>
          <span className="font-bold text-xs text-right whitespace-nowrap text-white">{countLevel1}</span>
        </div>
        <div className="flex items-center justify-between text-brand-secondary/90 border-b border-brand-primary/10 pb-1 mr-0.5">
          <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-brand-secondary" />L2 POP:</span>
          <span className="font-bold text-xs text-right whitespace-nowrap text-white">{countLevel2}</span>
        </div>
        <div className="flex items-center justify-between text-brand-secondary/70 border-b border-brand-primary/10 pb-1 mr-0.5">
          <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-brand-tertiary" />L3 POP:</span>
          <span className="font-bold text-xs text-right whitespace-nowrap text-white">{countLevel3}</span>
        </div>
        <div className="flex items-center justify-between text-brand-secondary/45 border-b border-brand-primary/10 pb-1 mr-0.5">
          <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-brand-inner border border-brand-primary/10" />L4 POP:</span>
          <span className="font-bold text-xs text-right whitespace-nowrap text-white">{countLevel4}</span>
        </div>
        <div className="flex items-center justify-between text-brand-secondary font-bold pt-0.5">
          <span className="font-bold select-none text-brand-secondary">TOTAL POP:</span>
          <span className="font-black text-xs text-right text-brand-secondary">{countTotal}</span>
        </div>
      </div>

      {/* 4. Navigation Breadcrumb Stack - Positioned beautifully at the top-center of the map */}
      {historyStack.length > 0 && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 max-w-[90%] md:max-w-[60%] lg:max-w-[50%] bg-brand-card/95 backdrop-blur-md px-3 py-2 rounded-brand-global border border-brand-primary/30 text-[10px] uppercase tracking-wider font-mono shadow-md">
          <button 
            onClick={onPopHistory}
            className="flex items-center gap-1 text-white hover:bg-brand-secondary px-3.5 py-1 rounded-brand-btn bg-brand-primary/80 transition border border-brand-secondary/30 active:scale-95 text-[9px] uppercase tracking-widest font-sans font-bold cursor-pointer"
          >
            ← Back Up
          </button>
          <div className="flex items-center gap-1 overflow-x-auto whitespace-nowrap scrollbar-thin text-gray-400">
            <span className="text-gray-500">Path:</span>
            <span className="text-brand-secondary hover:underline cursor-pointer" onClick={onResetCenter}>Root</span>
            {historyStack.map((hist, idx) => (
              <React.Fragment key={hist.userId}>
                <ChevronRight size={12} className="text-brand-primary/30 flex-shrink-0" />
                <span 
                  className="hover:underline cursor-pointer text-brand-secondary max-w-[80px] truncate"
                  onClick={() => {
                    // Navigate to this particular stack depth
                    const index = historyStack.findIndex(h => h.userId === hist.userId);
                    if (index >= 0) {
                      // Perform pop history to destination
                      for (let k = historyStack.length - 1; k >= index; k--) {
                        onPopHistory();
                      }
                    }
                  }}
                >
                  {hist.nickname}
                </span>
              </React.Fragment>
            ))}
            <ChevronRight size={12} className="text-brand-primary/30 flex-shrink-0" />
            <span className="text-white max-w-[100px] truncate">{rootNode.nickname}</span>
          </div>
        </div>
      )}

      {/* Main interactive SVG Container */}
      <svg
        ref={svgRef}
        className="w-full h-full cursor-grab active:cursor-grabbing z-0 relative"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ pointerEvents: "auto" }}
      >
        {/* Invisible backdrop to capture panning gestures accurately */}
        <rect id="bg-drag" width="100%" height="100%" fill="transparent" />

        <defs>
          {/* Neon Glo Filter for gorgeous vectors */}
          <filter id="glow-gold" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-cyan" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-purple" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-emerald" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Color Gradients custom designed for Hardware / Specialist Tool: beautiful shades of brand blue */}
          <linearGradient id="grad-0-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2f73f3" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#244fd4" stopOpacity="0.5" />
          </linearGradient>
          <linearGradient id="grad-1-2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2f73f3" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#182bb6" stopOpacity="0.25" />
          </linearGradient>
          <linearGradient id="grad-2-3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#182bb6" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#0c111f" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="grad-3-4" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#182bb6" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#0c111f" stopOpacity="0.03" />
          </linearGradient>
        </defs>

        {/* Central Transform Group representing zoom and pan mechanics */}
        <g transform={`translate(${window.innerWidth / 2 - 120 + pan.x}, ${350 + pan.y}) scale(${scale})`}>
          
          {/* Alternating Sector Backgrounds for each Level 1 branch */}
          {(() => {
            const level1Layout = layout.filter(n => n.level === 1);
            const N1 = level1Layout.length;
            if (N1 <= 1) return null;
            const W1 = (2 * Math.PI) / N1;
            const maxRadius = config.ring4Radius + 40;

            return (
              <g id="sector-backgrounds" className="pointer-events-none">
                {level1Layout.map((item, idx) => {
                  const startAng = item.angle - W1 / 2;
                  const endAng = item.angle + W1 / 2;

                  // Sector path generator coordinates
                  const x1 = maxRadius * Math.cos(startAng);
                  const y1 = maxRadius * Math.sin(startAng);
                  const x2 = maxRadius * Math.cos(endAng);
                  const y2 = maxRadius * Math.sin(endAng);
                  const largeArcFlag = W1 > Math.PI ? 1 : 0;
                  const pathData = `M 0 0 L ${x1} ${y1} A ${maxRadius} ${maxRadius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

                  // Alternating translucent color styling to provide dynamic grid contrast
                  let fillColor = "rgba(0, 243, 255, 0.01)"; // Fallback
                  
                  if (N1 % 2 === 0) {
                    // Even number of sectors: alternate perfectly between cyan soft tint and deep dark
                    fillColor = idx % 2 === 0 ? "rgba(0, 243, 255, 0.022)" : "rgba(0, 0, 0, 0.28)";
                  } else {
                    // Odd number of sectors: three-color to prevent collision at the wrap-around (idx = N1-1 adjacent to 0)
                    if (idx === N1 - 1) {
                      fillColor = "rgba(10, 20, 30, 0.55)"; // High contrast distinct dark-navy blend
                    } else if (idx % 2 === 0) {
                      fillColor = "rgba(0, 243, 255, 0.022)"; // Cyan soft tint
                    } else {
                      fillColor = "rgba(0, 0, 0, 0.28)";       // Deep dark
                    }
                  }
                  const strokeColor = "rgba(0, 243, 255, 0.08)";

                  return (
                    <g key={`sector-wedge-${item.node.userId}-${idx}`}>
                      {/* The shaded wedge */}
                      <path
                        d={pathData}
                        fill={fillColor}
                        stroke="none"
                      />
                      {/* Sector border lines dividing regions */}
                      <line
                        x1="0"
                        y1="0"
                        x2={x1}
                        y2={y1}
                        stroke={strokeColor}
                        strokeWidth="0.75"
                        strokeDasharray="4,4"
                      />
                      <line
                        x1="0"
                        y1="0"
                        x2={x2}
                        y2={y2}
                        stroke={strokeColor}
                        strokeWidth="0.75"
                        strokeDasharray="4,4"
                      />
                    </g>
                  );
                })}
              </g>
            );
          })()}
          
          {/* Level 1 Concentric Ring */}
          <circle
            cx="0"
            cy="0"
            r={config.ring1Radius}
            fill="none"
            stroke="rgba(36, 79, 210, 0.45)"
            strokeWidth="2.5"
            strokeDasharray="4,4"
          />
          {/* Dynamic Ring 1 Label in largest empty gap */}
          {(() => {
            const pos = getOrbitLabelPosition(1, config.ring1Radius);
            return (
              <g transform={`translate(${pos.x}, ${pos.y})`}>
                <rect
                  x="-23"
                  y="-7.5"
                  width="46"
                  height="15"
                  rx="3.5"
                  fill="#12151e"
                  stroke="rgba(47, 115, 243, 0.5)"
                  strokeWidth="1"
                />
                <text
                  x="0"
                  y="3"
                  className="fill-brand-secondary font-mono text-[7.5px] font-black tracking-wide text-center select-none"
                  textAnchor="middle"
                >
                  LEVEL 1
                </text>
              </g>
            );
          })()}

          {/* Level 2 Concentric Ring */}
          <circle
            cx="0"
            cy="0"
            r={config.ring2Radius}
            fill="none"
            stroke="rgba(36, 79, 210, 0.35)"
            strokeWidth="2"
            strokeDasharray="6,6"
          />
          {/* Dynamic Ring 2 Label */}
          {(() => {
            const pos = getOrbitLabelPosition(2, config.ring2Radius);
            return (
              <g transform={`translate(${pos.x}, ${pos.y})`}>
                <rect
                  x="-23"
                  y="-7.5"
                  width="46"
                  height="15"
                  rx="3.5"
                  fill="#12151e"
                  stroke="rgba(47, 115, 243, 0.4)"
                  strokeWidth="1"
                />
                <text
                  x="0"
                  y="3"
                  className="fill-brand-secondary/90 font-mono text-[7.5px] font-black tracking-wide text-center select-none"
                  textAnchor="middle"
                >
                  LEVEL 2
                </text>
              </g>
            );
          })()}

          {/* Level 3 Concentric Ring */}
          <circle
            cx="0"
            cy="0"
            r={config.ring3Radius}
            fill="none"
            stroke="rgba(36, 79, 210, 0.25)"
            strokeWidth="1.5"
            strokeDasharray="8,8"
          />
          {/* Dynamic Ring 3 Label */}
          {(() => {
            const pos = getOrbitLabelPosition(3, config.ring3Radius);
            return (
              <g transform={`translate(${pos.x}, ${pos.y})`}>
                <rect
                  x="-23"
                  y="-7.5"
                  width="46"
                  height="15"
                  rx="3.5"
                  fill="#12151e"
                  stroke="rgba(47, 115, 243, 0.3)"
                  strokeWidth="1"
                />
                <text
                  x="0"
                  y="3"
                  className="fill-brand-secondary/75 font-mono text-[7.5px] font-black tracking-wide text-center select-none"
                  textAnchor="middle"
                >
                  LEVEL 3
                </text>
              </g>
            );
          })()}

          {/* Level 4 Concentric Ring */}
          <circle
            cx="0"
            cy="0"
            r={config.ring4Radius}
            fill="none"
            stroke="rgba(36, 79, 210, 0.20)"
            strokeWidth="1.5"
            strokeDasharray="10,10"
          />
          {/* Dynamic Ring 4 Label */}
          {(() => {
            const pos = getOrbitLabelPosition(4, config.ring4Radius);
            return (
              <g transform={`translate(${pos.x}, ${pos.y})`}>
                <rect
                  x="-23"
                  y="-7.5"
                  width="46"
                  height="15"
                  rx="3.5"
                  fill="#12151e"
                  stroke="rgba(47, 115, 243, 0.2)"
                  strokeWidth="1"
                />
                <text
                  x="0"
                  y="3"
                  className="fill-brand-secondary/60 font-mono text-[7.5px] font-black tracking-wide text-center select-none"
                  textAnchor="middle"
                >
                  LEVEL 4
                </text>
              </g>
            );
          })()}

          {/* ========================================================= */}
          {/* Draw connecting curves / lines from parent to child nodes */}
          {/* ========================================================= */}
          {layout.map((item) => {
            if (item.parentX === null || item.parentY === null) return null;

            // Select matching gradient
            let gradientId = "grad-0-1";
            if (item.level === 2) gradientId = "grad-1-2";
            if (item.level === 3) gradientId = "grad-2-3";

            // Sleek sci-fi glowing beam connecting lines
            return (
              <g key={`edge-${item.node.userId}-${item.level}`}>
                {/* Background Shadow line for thickness */}
                <line
                  x1={item.parentX}
                  y1={item.parentY}
                  x2={item.x}
                  y2={item.y}
                  stroke="#244fd4"
                  strokeWidth="2.5"
                  className="opacity-[0.05]"
                />
                
                {/* Active vector branch */}
                <line
                  x1={item.parentX}
                  y1={item.parentY}
                  x2={item.x}
                  y2={item.y}
                  stroke={`url(#${gradientId})`}
                  strokeWidth="1"
                  className="opacity-40"
                />

                {/* Cyber energetic data pulse particle traversing connection logs */}
                <circle r="2.5" fill="#2f73f3">
                  <animateMotion
                    dur={`${3 + (4 - item.level) * 2}s`}
                    repeatCount="indefinite"
                    path={`M ${item.parentX} ${item.parentY} L ${item.x} ${item.y}`}
                  />
                </circle>
              </g>
            );
          })}

          {/* ========================================================= */}
          {/* Draw User Nodes as high fidelity group elements */}
          {/* ========================================================= */}
          {layout.map((item) => {
            const isSelected = selectedNode?.userId === item.node.userId;
            const r = item.nodeRadius;

            // Determine border tones
            let strokeColor = "#2f73f3";
            let opacityVal = isSelected ? "1" : "0.5";
            if (item.level === 1) opacityVal = isSelected ? "0.9" : "0.4";
            if (item.level === 2) opacityVal = isSelected ? "0.75" : "0.3";
            if (item.level === 3) opacityVal = isSelected ? "0.6" : "0.2";
            if (item.level === 4) opacityVal = isSelected ? "0.5" : "0.15";

            // Math to position direct_referrals badge overlap at bottom right (angle 45 degrees)
            const badgeAngle = Math.PI / 4; // 45 degrees
            const badgeOffsetRadius = r;
            const badgeX = Math.cos(badgeAngle) * badgeOffsetRadius;
            const badgeY = Math.sin(badgeAngle) * badgeOffsetRadius;
            const badgeSize = item.level === 0 ? 11 : item.level === 1 ? 9.5 : 8.5;

            // Direct referrals count
            const subNodeCount = item.node.direct_referrals ?? 0;

            const initials = item.node.nickname
              ? item.node.nickname.slice(0, 2).toUpperCase()
              : "U";

            return (
              <g
                key={`node-${item.node.userId}-${item.level}`}
                transform={`translate(${item.x}, ${item.y})`}
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectNode(item.node);
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  if (item.level > 0) {
                     onCenterNode(item.node);
                  }
                }}
                onMouseEnter={() => setHoverNode(item)}
                onMouseLeave={() => setHoverNode(null)}
              >
                {/* Node Outer Selection Glow Halo ring if highlighted */}
                {isSelected && (
                  <circle
                    r={r + 6}
                    fill="none"
                    stroke="#2f73f3"
                    strokeWidth="1"
                    strokeDasharray="2,2"
                    className="animate-spin-slow opacity-80"
                    style={{ transformOrigin: "0px 0px" }}
                  />
                )}

                {/* Neon Aura Backing shadow */}
                {isSelected && (
                  <circle
                    r={r + 2}
                    fill="none"
                    stroke="#244fd4"
                    strokeWidth={2}
                    className="opacity-40"
                    filter="url(#glow-cyan)"
                  />
                )}

                {/* Main colored avatar ring bezel using Brand Card Color #12151e */}
                <circle
                  r={r}
                  fill="#12151e"
                  stroke="#244fd4"
                  strokeWidth={item.level === 0 ? 3 : isSelected ? 2 : 1}
                  strokeOpacity={opacityVal}
                  className="shadow-xl"
                  filter={item.level === 0 ? `url(#glow-cyan)` : undefined}
                />

                {/* Avatar Display inside ClipPath to maintain circle */}
                <g>
                   <clipPath id={`clip-${item.node.userId}-${item.level}`}>
                    <circle r={r - (item.level === 0 ? 3 : 1)} />
                  </clipPath>
                  
                  {item.node.avatar?.file?.image && !failedImages[item.node.userId] ? (
                    <image
                      href={item.node.avatar.file.image}
                      x={-r}
                      y={-r}
                      height={r * 2}
                      width={r * 2}
                      clipPath={`url(#clip-${item.node.userId}-${item.level})`}
                      preserveAspectRatio="xMidYMid slice"
                      referrerPolicy="no-referrer"
                      onError={() => {
                        setFailedImages((prev) => ({ ...prev, [item.node.userId]: true }));
                      }}
                    />
                  ) : (
                    /* Specialist Initial display layout - ONLY rendered when no avatar image or if it failed to load */
                    <text
                      className="fill-white font-mono font-bold tracking-tight text-center pointer-events-none"
                      textAnchor="middle"
                      dominantBaseline="central"
                      y="1"
                      fontSize={item.level === 0 ? 18 : Math.max(5, Math.min(14, r * 0.70))}
                    >
                      {initials}
                    </text>
                  )}
                </g>

                {/* Display Small badge representing children directly underneath of node */}
                {subNodeCount > 0 && (
                  <g transform={`translate(${badgeX}, ${badgeY})`}>
                    <circle
                      r={badgeSize}
                      fill="#0c111f"
                      stroke="#2f73f3"
                      strokeWidth="1"
                      strokeOpacity={opacityVal}
                    />
                    <text
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="#2f73f3"
                      fontFamily="monospace"
                      fontWeight="bold"
                      fontSize={badgeSize > 9 ? "7.5px" : "6px"}
                      y="0.5"
                    >
                      {subNodeCount}
                    </text>
                  </g>
                )}

                {/* User Nicename Label underneath standard nodes with dynamic scale-based size */}
                <text
                  y={r + (item.level === 0 ? 16 : 14)}
                  className="fill-gray-300 font-mono uppercase font-medium tracking-wide text-center"
                  textAnchor="middle"
                  style={{ 
                    textShadow: "0 2px 4px rgba(0,0,0,0.9)",
                    fontSize: `${Math.max(6, Math.min(10, 10 * Math.sqrt(scale)))}px`
                  }}
                >
                  {item.node.nickname}
                </text>

                {/* Special Core indicator for root node */}
                {item.level === 0 && (
                  <g transform={`translate(0, ${r + 26})`}>
                    <text
                      y="4"
                      className="fill-brand-secondary font-mono text-[8px] font-bold tracking-[0.3em] text-center uppercase"
                      textAnchor="middle"
                    >
                      CORE
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* Floating Canvas Action Tool panel bottom right - Styled with Global Radius 20px, buttons using Button Radius (32px or circular rounded-full) */}
      <div className="absolute bottom-6 right-6 z-10 flex items-center gap-2 bg-brand-card/95 backdrop-blur-xl border border-brand-primary/25 p-2 rounded-brand-global shadow-xl">
        <button
          onClick={zoomIn}
          title="Zoom In"
          className="w-8 h-8 flex items-center justify-center text-[#e2e8f0] hover:text-white bg-brand-inner hover:bg-brand-primary/10 rounded-full border border-brand-primary/20 transition active:scale-95 cursor-pointer"
          id="btn-zoomin"
        >
          <Plus size={14} />
        </button>
        <button
          onClick={zoomOut}
          title="Zoom Out"
          className="w-8 h-8 flex items-center justify-center text-[#e2e8f0] hover:text-white bg-brand-inner hover:bg-brand-primary/10 rounded-full border border-brand-primary/20 transition active:scale-95 cursor-pointer"
          id="btn-zoomout"
        >
          <Minus size={14} />
        </button>
        <button
          onClick={resetZoom}
          title="Reset Camera & Fit View"
          className="w-8 h-8 flex items-center justify-center text-brand-secondary hover:text-white bg-brand-inner hover:bg-brand-primary/10 rounded-full border border-brand-primary/20 transition active:scale-95 cursor-pointer"
          id="btn-recenter"
        >
          <RotateCcw size={13} />
        </button>
        {historyStack.length > 0 && (
          <button
            onClick={onResetCenter}
            title="Reset to Base Root User"
            className="px-3 h-8 flex items-center gap-1 text-[9px] font-mono font-bold text-brand-secondary hover:text-white bg-brand-inner hover:bg-brand-primary/10 rounded-brand-btn border border-brand-primary/20 transition active:scale-95 uppercase tracking-widest cursor-pointer whitespace-nowrap"
            id="btn-root"
          >
            <Target size={12} />
            <span>ROOT</span>
          </button>
        )}
      </div>

      {/* Inline Interactive Overlay Informative card for current hovered node - Global Radius 20px, Inner metrics containers using #0c111f */}
      <AnimatePresence>
        {hoverNode && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-[350px] bg-brand-card/98 backdrop-blur-xl border border-brand-primary/30 rounded-brand-global p-4 shadow-[0_8px_32px_rgba(36,79,212,0.25)] pointer-events-none flex flex-col gap-3 font-sans"
          >
            {/* Top header region */}
            <div className="flex items-center justify-between">
              <span className="text-[8px] px-2 py-0.5 rounded-brand-btn font-mono font-bold uppercase bg-brand-inner text-brand-secondary border border-brand-primary/20">
                LEVEL {hoverNode.level}
              </span>
              <div className="flex items-center gap-2.5 text-right">
                <div className="flex flex-col">
                  <span className="text-white font-bold text-xs uppercase tracking-wide">{hoverNode.node.nickname}</span>
                  <span className="text-[9px] font-mono text-gray-500">{hoverNode.node.userId}</span>
                </div>
                <div 
                  className="w-9 h-9 rounded-full bg-brand-inner border flex-shrink-0 flex items-center justify-center font-bold text-white text-[11px]" 
                  style={{ borderColor: getGlowColor(hoverNode.level) }}
                >
                  {hoverNode.node.nickname.slice(0, 2).toUpperCase()}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-brand-primary/20 to-transparent" />

            {/* Metrics grid row - Using #000 with 20% opacity (bg-brand-inner) and Global Radius 20px */}
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-brand-inner rounded-brand-global p-2.5 border border-white/5 font-mono">
                <span className="text-[8px] text-gray-400 block mb-0.5">Total Team Volume</span>
                <span className="text-[#e2e8f0] font-bold text-[11px] block">{formatVolume(hoverNode.node.total_team_volume)}</span>
              </div>
              <div className="bg-brand-inner rounded-brand-global p-2.5 border border-brand-primary/10 font-mono">
                <span className="text-[8px] text-gray-400 block mb-0.5">Total Network Nodes</span>
                <span className="text-brand-secondary font-bold text-[11px] block">{hoverNode.node.total_network_size} NODES</span>
              </div>
            </div>

            {/* Action Tip */}
            <div className="text-center">
              <span className="text-[9px] text-brand-secondary/80 font-semibold animate-pulse tracking-wide font-mono">
                🎯 DBL-CLK TO TRAVEL / SET AS ROOT CENTER
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
