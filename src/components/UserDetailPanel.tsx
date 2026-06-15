/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { UserNode } from "../types";
import { 
  User, 
  MapPin, 
  Layers, 
  TrendingUp, 
  Calendar, 
  Activity, 
  Wallet, 
  Award,
  ChevronRight,
  Sparkles,
  Target
} from "lucide-react";

interface UserDetailPanelProps {
  node: UserNode | null;
  onCenterNode: (node: UserNode) => void;
  rootNode: UserNode;
}

export default function UserDetailPanel({
  node,
  onCenterNode,
  rootNode,
}: UserDetailPanelProps) {
  if (!node) {
    return (
      <div className="w-full bg-brand-card border border-brand-primary/20 rounded-brand-global p-6 flex flex-col items-center justify-center text-center h-full min-h-[400px] font-mono uppercase tracking-wider">
        <div className="w-16 h-16 rounded-full bg-brand-inner border border-brand-primary/30 flex items-center justify-center text-brand-secondary mb-4 animate-pulse">
          <User size={24} />
        </div>
        <h3 className="text-white font-bold text-xs uppercase">No active selection</h3>
        <p className="text-brand-secondary/70 text-[9px] mt-2 max-w-[200px] leading-relaxed">
          Select or double click any citizen on the solar grid to initiate telemetry capture.
        </p>
      </div>
    );
  }

  // Parse values in clean structures
  const isCentered = rootNode.userId === node.userId;
  const rank = node.rank || "Citizens";
  const joinDate = new Date(node.join_date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  // Simple rule: Active if they has direct referrals or some personal/team volume; else Idle.
  const isActive = node.direct_referrals > 0 || parseFloat(node.total_team_volume) > 0;

  // Formatting helpers for large quantities
  const parseWei = (val: string) => {
    if (val === "0" || !val) return "0.00 W3H";
    const valNum = parseFloat(val) / 1e18;
    return valNum.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 }) + " W3H";
  };

  return (
    <div className="w-full bg-brand-card border border-brand-primary/20 rounded-brand-global overflow-hidden shadow-2xl flex flex-col h-full font-mono text-[10px] uppercase tracking-wider">
      
      {/* 3D Glass Header */}
      <div className="relative p-4 bg-brand-inner border-b border-brand-primary/20">
        <div className="absolute right-3 top-3 flex items-center gap-1.5 bg-brand-card border border-brand-primary/30 px-2 py-0.5 rounded text-[8px] tracking-widest text-brand-secondary">
          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-brand-secondary animate-pulse" : "bg-gray-600"}`} />
          {isActive ? "ACTIVE NODE" : "IDLE NODE"}
        </div>

        {/* User initials */}
        <div className="flex items-center gap-3.5 mt-2">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-tr from-brand-tertiary to-brand-secondary border border-brand-primary/40 flex items-center justify-center text-white font-sans text-sm font-bold tracking-tight">
            {node.nickname.slice(0, 2).toUpperCase()}
          </div>
          <div className="text-left">
            <h4 className="text-white text-xs font-bold font-sans tracking-wide uppercase leading-snug">
              {node.nickname}
            </h4>
            <span className="text-[8px] text-gray-400 block mt-0.5">ID: {node.userId}</span>
          </div>
        </div>
      </div>

      {/* Profile Metrics Grid */}
      <div className="p-4 flex-1 flex flex-col gap-4">
        
        {/* Core blockchain stats holding the multi-level layout volume records */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-brand-inner p-2.5 rounded-brand-global text-left border border-white/5">
            <span className="text-[8px] text-gray-500 block mb-0.5">Level</span>
            <span className="text-white font-bold">{isCentered ? "L1 DIRECT" : `L${node.level_from_you} NODE`}</span>
          </div>
          <div className="bg-brand-inner p-2.5 rounded-brand-global text-left border border-white/5">
            <span className="text-[8px] text-gray-500 block mb-0.5">Joined</span>
            <span className="text-white italic">{joinDate}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="bg-brand-inner p-2.5 rounded-brand-global text-left border border-white/5">
            <span className="text-[8px] text-gray-500 block mb-0.5">Direct Referrals</span>
            <span className="text-white font-bold block">{node.direct_referrals} USERS</span>
          </div>
          <div className="bg-brand-inner p-2.5 rounded-brand-global text-left border border-white/5">
            <span className="text-[8px] text-gray-500 block mb-0.5">Descendants</span>
            <span className="text-brand-secondary font-bold block">{node.total_network_size} NODES</span>
          </div>
        </div>

        {/* Financial Web3 Volumes */}
        <div className="space-y-2">
          <div className="bg-brand-inner p-3 rounded-brand-global border border-white/5">
            <div className="flex justify-between items-center text-gray-400 mb-1">
              <span className="text-[8px] flex items-center gap-1.5 text-gray-500">
                <Wallet size={10} className="text-brand-secondary" />
                Personal Volume
              </span>
            </div>
            <div className="text-white text-xs text-left font-bold truncate">
              {parseWei(node.personal_sales_volume)}
            </div>
          </div>

          <div className="bg-brand-inner p-3 rounded-brand-global border border-white/5">
            <div className="flex justify-between items-center text-gray-400 mb-1 text-left">
              <span className="text-[8px] flex items-center gap-1.5 text-gray-500">
                <TrendingUp size={10} className="text-brand-secondary" />
                Personal Sales
              </span>
            </div>
            <div className="text-brand-secondary text-xs text-left font-bold truncate">
              {parseWei(node.total_team_volume)}
            </div>
          </div>
        </div>

        {/* Network Rank parameters */}
        <div className="bg-brand-inner p-3 rounded-brand-global border border-white/5 text-left space-y-2">
          <div className="flex justify-between items-center text-[9px]">
            <span className="text-gray-500 flex items-center gap-1">
              <Award size={11} className="text-brand-secondary" />
              Network Ranking
            </span>
            <span className="text-white font-bold bg-brand-primary/10 border border-brand-primary/35 px-2 py-0.5 rounded-brand-btn">
              {rank}
            </span>
          </div>
        </div>

        {/* 🎯 Primary Action: Bring to Center */}
        <div className="mt-auto pt-2">
          {isCentered ? (
            <div className="w-full text-center py-2.5 px-3 bg-brand-primary/15 border border-brand-primary/30 rounded-brand-btn text-brand-secondary font-bold flex items-center justify-center gap-1.5 select-none uppercase tracking-widest">
              <Sparkles size={11} className="animate-pulse" />
              ROOT NODE TELEMETRY ENGAGED
            </div>
          ) : (
            <button
              onClick={() => onCenterNode(node)}
              className="w-full py-2.5 px-3 bg-brand-primary hover:bg-brand-secondary text-white text-[10px] rounded-brand-btn font-bold uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 border border-brand-secondary/35 shadow-md shadow-black/30"
              id="btn-center-focus"
            >
              <Target size={11} />
              Set as Root Center
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
