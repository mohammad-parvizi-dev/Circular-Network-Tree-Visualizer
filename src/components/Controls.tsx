/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { UserNode } from "../types";
import { 
  Sparkles, 
  Sliders, 
  Plus, 
  Trash2, 
  UserPlus, 
  CheckCircle,
  HelpCircle,
  TrendingUp,
  Award
} from "lucide-react";

interface ControlsProps {
  currentTree: UserNode;
  onSelectNode: (node: UserNode) => void;
  onCenterNode: (node: UserNode) => void;
  onGenerateRandom: (preset: string) => void;
  onAddCustomNode: (parentUserId: string, nickname: string, rank: string) => void;
  selectedNode: UserNode | null;
}

export default function Controls({
  currentTree,
  onSelectNode,
  onCenterNode,
  onGenerateRandom,
  onAddCustomNode,
  selectedNode,
}: ControlsProps) {
  const [addNickname, setAddNickname] = useState("");
  const [addRank, setAddRank] = useState("Citizens");
  const [addSuccessMsg, setAddSuccessMsg] = useState("");

  const ranks = ["Citizens", "Agents", "Sales Associates", "Mentors", "Consultants", "Ambassadors"];

  const handleAddNodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNode) return;
    if (!addNickname.trim()) return;

    onAddCustomNode(selectedNode.userId, addNickname.trim(), addRank);
    setAddNickname("");
    setAddSuccessMsg(`Successfully added ${addNickname} under ${selectedNode.nickname}!`);
    setTimeout(() => setAddSuccessMsg(""), 3500);
  };

  return (
    <div className="w-full flex flex-col gap-5 text-left text-[10px] font-mono uppercase tracking-wider font-semibold">
      
      {/* 1. Dataset presets control panel exactly matching custom requirement */}
      <div className="bg-brand-card border border-brand-primary/20 rounded-brand-global p-4 shadow-xl">
        <label className="text-[9px] text-gray-500 font-bold uppercase block mb-3 flex items-center gap-1.5">
          <Sparkles size={12} className="text-brand-secondary" />
          TELEMETRY MATRIX GENERATORS
        </label>
        
        <div className="grid grid-cols-1 gap-2">
          <button
            onClick={() => onGenerateRandom("default")}
            className="w-full py-2 px-3 bg-brand-inner hover:bg-brand-primary/10 text-gray-300 hover:text-white rounded-brand-btn border border-brand-primary/20 transition flex items-center justify-between cursor-pointer text-[10px] uppercase font-mono tracking-widest"
            id="preset-default"
          >
            <span className="font-sans font-bold text-left min-w-0 truncate">CHALLENGE INPUT (WEB3HUB)</span>
            <span className="text-[8px] px-1.5 py-0.2 bg-brand-primary/10 text-brand-secondary rounded-brand-btn border border-brand-primary/20 uppercase flex-shrink-0">EXACT</span>
          </button>

          <button
            onClick={() => onGenerateRandom("balanced")}
            className="w-full py-2 px-3 bg-brand-inner hover:bg-brand-primary/10 text-gray-300 hover:text-white rounded-brand-btn border border-brand-primary/20 transition flex items-center justify-between cursor-pointer text-[10px] uppercase font-mono tracking-widest"
            id="preset-balanced"
          >
            <span className="font-sans font-bold text-left min-w-0 truncate">BALANCED WIDE MATRIX</span>
            <span className="text-[8px] px-1.5 py-0.2 bg-brand-primary/10 text-brand-secondary rounded-brand-btn border border-brand-primary/20 uppercase flex-shrink-0">DEEP</span>
          </button>

          <button
            onClick={() => onGenerateRandom("dense")}
            className="w-full py-2 px-3 bg-brand-inner hover:bg-brand-primary/10 text-gray-300 hover:text-white rounded-brand-btn border border-brand-primary/20 transition flex items-center justify-between cursor-pointer text-[10px] uppercase font-mono tracking-widest"
            id="preset-dense"
          >
            <span className="font-sans font-bold text-left min-w-0 truncate">EXPONENTIAL MASSIVE MATRIX</span>
            <span className="text-[8px] px-1.5 py-0.2 bg-brand-primary/10 text-brand-secondary rounded-brand-btn border border-brand-primary/20 uppercase flex-shrink-0">DENSE</span>
          </button>

          <button
            onClick={() => onGenerateRandom("sparse")}
            className="w-full py-2 px-3 bg-brand-inner hover:bg-brand-primary/10 text-gray-300 hover:text-white rounded-brand-btn border border-brand-primary/20 transition flex items-center justify-between cursor-pointer text-[10px] uppercase font-mono tracking-widest"
            id="preset-sparse"
          >
            <span className="font-sans font-bold text-left min-w-0 truncate">SPARSE SLENDER MATRIX</span>
            <span className="text-[8px] px-1.5 py-0.2 bg-brand-primary/10 text-brand-secondary rounded-brand-btn border border-brand-primary/20 uppercase flex-shrink-0">SPARSE</span>
          </button>
        </div>
      </div>

      {/* 3. Add Custom Node Form */}
      <div className="bg-brand-card border border-brand-primary/20 rounded-brand-global p-4 shadow-xl">
        <label className="text-[9px] text-gray-500 font-bold uppercase block mb-2 flex items-center gap-1.5">
          <UserPlus size={12} className="text-brand-secondary" />
          ADD TELEMETRY CITIZEN
        </label>

        {selectedNode ? (
          <form onSubmit={handleAddNodeSubmit} className="space-y-3">
            <div className="text-[9px] text-gray-400">
              TARGET PLACEMENT UNDER: <span className="text-white font-bold">{selectedNode.nickname}</span>
            </div>

            <div>
              <input
                type="text"
                value={addNickname}
                onChange={(e) => setAddNickname(e.target.value)}
                placeholder="ENTER NICKNAME (E.G. ALPHA-1)..."
                maxLength={18}
                className="w-full bg-brand-inner border border-brand-primary/20 rounded-brand-btn px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-brand-secondary transition font-mono text-[10px] uppercase"
                required
                id="input-add-nickname"
              />
            </div>

            <div className="flex gap-2">
              <div className="w-1/2">
                <select
                  value={addRank}
                  onChange={(e) => setAddRank(e.target.value)}
                  className="w-full bg-brand-inner border border-brand-primary/20 rounded-brand-btn px-3 py-2 text-white focus:outline-none focus:border-brand-secondary transition font-mono text-[10px] uppercase"
                  id="select-add-rank"
                >
                  {ranks.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div className="w-1/2">
                <button
                  type="submit"
                  className="w-full py-2 bg-brand-primary hover:bg-brand-secondary text-white text-[10px] font-mono tracking-widest rounded-brand-btn transition border border-brand-secondary/35 cursor-pointer font-bold uppercase active:scale-95 shadow-md shadow-black/20"
                  id="btn-add-submit"
                >
                  CONFIRM ADD
                </button>
              </div>
            </div>

            {addSuccessMsg && (
              <div className="p-2 bg-brand-primary/10 border border-brand-primary/30 text-brand-secondary text-[9px] tracking-wider rounded-brand-btn flex items-center gap-1.5 animate-pulse">
                <CheckCircle size={12} />
                <span>{addSuccessMsg}</span>
              </div>
            )}
          </form>
        ) : (
          <div className="p-3 rounded-brand-global bg-brand-inner border border-brand-primary/15 text-center text-gray-500 leading-relaxed text-[9px]">
            Please click on any user node in the solar graph first to specify the parent placement.
          </div>
        )}
      </div>

    </div>
  );
}
