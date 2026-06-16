import React, { useState, useMemo } from "react";
import { UserNode } from "./types";
import { INITIAL_TREE_DATA, generateMockTree, findUserNodeById, extractSubtreeAsRoot } from "./mockData";
import NetworkGraph from "./components/NetworkGraph";
import UserDetailPanel from "./components/UserDetailPanel";
import Controls from "./components/Controls";
import DeveloperGuide from "./components/DeveloperGuide";
import { motion, AnimatePresence } from "motion/react";
import { 
  Users, 
  TrendingUp, 
  Database,
  Cpu,
  Sparkles,
  Layers,
  Search
} from "lucide-react";

export default function App() {
  // Master data state holding full tree hierarchy
  const [masterTree, setMasterTree] = useState<UserNode>(INITIAL_TREE_DATA[0]);

  // Current view's root focus center node ID
  const [centerNodeId, setCenterNodeId] = useState<string>(INITIAL_TREE_DATA[0].userId);

  // History path stack of navigated center node IDs for easy back-navigation
  const [historyStackIds, setHistoryStackIds] = useState<string[]>([]);

  // Selected node currently inspected in the right sidebar details panel
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(INITIAL_TREE_DATA[0].userId);

  // Sidebar Search bar query
  const [searchQuery, setSearchQuery] = useState("");

  // Floating menu State (Hamburger menu toggle)
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuTab, setMenuTab] = useState<"admin" | "docs">("docs");

  // Flatten tree recursive helper for search
  const allTreeNodes = useMemo(() => {
    const list: UserNode[] = [];
    const traverse = (node: UserNode) => {
      list.push(node);
      if (node.children) {
        node.children.forEach(traverse);
      }
    };
    traverse(masterTree);
    return list;
  }, [masterTree]);

  // Filtered search results
  const searchResults = useMemo(() => {
    if (!searchQuery) return [];
    const lowerQuery = searchQuery.toLowerCase();
    return allTreeNodes.filter(
      n =>
        n.nickname.toLowerCase().includes(lowerQuery) ||
        n.userId.toLowerCase().includes(lowerQuery)
    ).slice(0, 5);
  }, [allTreeNodes, searchQuery]);

  // Find the center node in our Master Tree
  const currentCenterNode = useMemo(() => {
    const found = findUserNodeById(masterTree, centerNodeId);
    return found || masterTree;
  }, [masterTree, centerNodeId]);

  // Extract local view of up to 4 levels centered around the current focus node
  const activeLocalViewTree = useMemo(() => {
    return extractSubtreeAsRoot(currentCenterNode);
  }, [currentCenterNode]);

  // Find the selected node in our Master Tree
  const currentSelectedNode = useMemo(() => {
    if (!selectedNodeId) return null;
    return findUserNodeById(masterTree, selectedNodeId);
  }, [masterTree, selectedNodeId]);

  // Generate history node list for breadcrumbs
  const historyStackNodes = useMemo(() => {
    return historyStackIds
      .map(id => findUserNodeById(masterTree, id))
      .filter((n): n is UserNode => n !== null);
  }, [masterTree, historyStackIds]);

  // Handle setting a new center node focus (zooming/traveling in)
  const handleCenterNode = (node: UserNode) => {
    if (node.userId === centerNodeId) return;

    // Check if the node exists in the current lineage path to prevent loops
    if (historyStackIds.includes(node.userId)) {
      // Just slide back current stack to that level
      const idx = historyStackIds.indexOf(node.userId);
      setHistoryStackIds(prev => prev.slice(0, idx));
      setCenterNodeId(node.userId);
      return;
    }

    // Otherwise push current focus to history stack and travel deeper
    setHistoryStackIds(prev => [...prev, centerNodeId]);
    setCenterNodeId(node.userId);
    setSelectedNodeId(node.userId);
  };

  // Navigating back one level
  const handlePopHistory = () => {
    if (historyStackIds.length === 0) return;
    const nextHistory = [...historyStackIds];
    const previousCenterId = nextHistory.pop()!;
    setHistoryStackIds(nextHistory);
    setCenterNodeId(previousCenterId);
    setSelectedNodeId(previousCenterId);
  };

  // Reset core focus to the top absolute master root
  const handleResetCenter = () => {
    setCenterNodeId(masterTree.userId);
    setHistoryStackIds([]);
    setSelectedNodeId(masterTree.userId);
  };

  // Generate completely random and varied datasets
  const handleGenerateRandomDataset = (preset: string) => {
    let newRoot: UserNode;
    if (preset === "default") {
      newRoot = INITIAL_TREE_DATA[0];
    } else if (preset === "balanced") {
      newRoot = generateMockTree("web3hub-balanced", 4, [2, 3], 0, null);
    } else if (preset === "dense") {
      newRoot = generateMockTree("web3hub-exponential", 4, [3, 4], 0, null);
    } else {
      newRoot = generateMockTree("web3hub-sparse", 4, [1, 2], 0, null);
    }

    setMasterTree(newRoot);
    setCenterNodeId(newRoot.userId);
    setHistoryStackIds([]);
    setSelectedNodeId(newRoot.userId);
  };

  // Add custom user node under any selected user in the master tree structure
  const handleAddCustomNode = (parentUserId: string, nickname: string, rank: string) => {
    const newUserId = `0xW3H${Math.random().toString(16).substr(2, 6).toUpperCase()}#x0${Math.floor(Math.random() * 90000 + 10000)}`;
    const newChildNode: UserNode = {
      avatar: null,
      nickname,
      userId: newUserId,
      parent_id: parentUserId,
      join_date: new Date().toISOString(),
      level_from_you: 1, // calculated contextually
      rank,
      direct_referrals: 0,
      total_network_size: 0,
      total_team_volume: "0",
      personal_sales_volume: "0",
      has_children: false,
      children: [],
    };

    // Deep update function on master tree path
    const addNodeRecursive = (current: UserNode): boolean => {
      if (current.userId === parentUserId) {
        current.children.push(newChildNode);
        current.direct_referrals = current.children.length;
        current.has_children = true;
        // recalculate totals
        current.total_network_size += 1;
        return true;
      }

      for (const child of current.children) {
        const foundAndModified = addNodeRecursive(child);
        if (foundAndModified) {
          // Increment network metrics upward
          current.total_network_size += 1;
          return true;
        }
      }

      return false;
    };

    const cloneMaster = JSON.parse(JSON.stringify(masterTree)) as UserNode;
    addNodeRecursive(cloneMaster);
    setMasterTree(cloneMaster);

    // Set added node as selected for easy verification
    setSelectedNodeId(newUserId);
  };

  // Formatting helpers for large aggregated metrics
  const formatWei = (val: string) => {
    if (val === "0" || !val) return "0";
    if (val.length > 21) {
      const numDigits = val.length - 18;
      return (parseFloat(val.slice(0, numDigits)) / 1000).toFixed(1) + "M BNB";
    }
    const valNum = parseFloat(val) / 1e18;
    return valNum.toLocaleString(undefined, { maximumFractionDigits: 1 }) + " BNB";
  };

  return (
    <div className="w-screen h-screen max-h-screen bg-brand-bg text-[#e2e8f0] flex relative overflow-hidden font-sans select-none">
      
      {/* 3D Grid Perspective Mesh background */}
      <div 
        className="absolute bottom-0 left-0 w-full h-[300px] opacity-[0.04] pointer-events-none z-0" 
        style={{ 
          backgroundImage: "linear-gradient(0deg, #244fd4 1px, transparent 1px), linear-gradient(90deg, #244fd4 1px, transparent 1px)", 
          backgroundSize: "40px 40px", 
          transform: "perspective(500px) rotateX(60deg)",
          transformOrigin: "bottom center"
        }} 
      />

      {/* Cyber ambient grid backing */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(rgba(36,79,212,0.08)_1px,transparent_1px)] [background-size:28px_28px] opacity-[0.35] pointer-events-none" />

      {/* MAIN LAYOUT CORES */}
      
      {/* LEFT AREA: Network concentric map canvas */}
      <div className="flex-1 h-full relative overflow-hidden">
        <NetworkGraph
          rootNode={activeLocalViewTree}
          selectedNode={currentSelectedNode}
          onSelectNode={(node) => setSelectedNodeId(node.userId)}
          onCenterNode={handleCenterNode}
          onResetCenter={handleResetCenter}
          historyStack={historyStackNodes}
          onPopHistory={handlePopHistory}
        />
      </div>

      {/* RIGHT SIDEBAR PANEL: Aggregated metrics & Full details inspector */}
      <div className="w-[360px] md:w-[410px] h-full border-l border-brand-primary/15 bg-brand-card/95 backdrop-blur-xl flex flex-col relative z-20 flex-shrink-0 shadow-[-5px_0_30px_rgba(0,0,0,0.7)]">
        
        {/* Sleek top search bar container - Core application feature */}
        <div className="p-4 border-b border-brand-primary/20 bg-brand-card">
          <div className="flex items-center gap-2 mb-2">
            <Search size={12} className="text-brand-secondary" />
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-gray-500">
              TELEMETRY SEARCH DIRECTORY
            </span>
          </div>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ENTER NICKNAME OR ID..."
              className="w-full bg-brand-inner border border-brand-primary/20 rounded-brand-btn px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-brand-secondary transition font-mono text-[10px] uppercase"
              id="input-sidebar-search"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                ×
              </button>
            )}
          </div>

          {/* Search results overlay dropdown */}
          {searchResults.length > 0 && (
            <div className="mt-2.5 space-y-1 bg-brand-card/95 backdrop-blur-xl rounded-brand-global border border-brand-primary/25 overflow-hidden max-h-[180px] overflow-y-auto scrollbar-thin shadow-2xl">
              {searchResults.map((res) => (
                <button
                  key={res.userId}
                  onClick={() => {
                    setSelectedNodeId(res.userId);
                    setSearchQuery("");
                  }}
                  className="w-full text-left p-2.5 hover:bg-brand-primary/10 flex items-center justify-between border-b border-brand-primary/10 last:border-b-0 transition text-[10px] uppercase font-mono"
                >
                  <div className="min-w-0 pr-2">
                    <div className="text-white font-bold font-sans truncate">{res.nickname}</div>
                    <div className="text-[7.5px] text-gray-500 truncate">ID: {res.userId}</div>
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0">
                    <span className="text-[7.5px] bg-brand-primary/10 text-brand-secondary px-1.5 py-0.5 rounded-brand-btn border border-brand-primary/20">
                      SELECT
                    </span>
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCenterNode(res);
                        setSearchQuery("");
                      }}
                      className="text-[7.5px] bg-brand-primary/20 text-brand-secondary px-1.5 py-0.5 rounded-brand-btn border border-brand-primary/30 uppercase hover:bg-brand-secondary hover:text-white transition cursor-pointer"
                    >
                      CENTER
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {searchQuery && searchResults.length === 0 && (
            <div className="mt-2 text-[8px] font-mono text-brand-secondary/50 italic uppercase">
              No citizen matches query.
            </div>
          )}
        </div>

        {/* Global master statistics bar */}
        <div className="p-4 bg-brand-inner border-b border-brand-primary/25">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-brand-secondary animate-pulse shadow-[0_0_8px_#2f73f3]"></span>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-brand-secondary/85">Live Database Telemetry</span>
          </div>
          <div className="grid grid-cols-2 gap-3.5">
            <div className="bg-brand-inner p-3 rounded-brand-global border border-white/5 text-left font-mono">
              <span className="text-gray-500 text-[8px] uppercase tracking-wider block mb-0.5">Total Community</span>
              <span className="text-brand-secondary font-bold text-sm block flex items-center justify-start gap-1.5">
                <Users size={12} className="text-brand-secondary" />
                {(masterTree.total_network_size + 1).toLocaleString()}
              </span>
            </div>
            <div className="bg-brand-inner p-3 rounded-brand-global border border-white/5 text-left font-mono">
              <span className="text-gray-500 text-[8px] uppercase tracking-wider block mb-0.5">Total Volume</span>
              <span className="text-white font-bold text-sm block truncate flex items-center justify-start gap-1.5">
                <TrendingUp size={12} className="text-brand-secondary" />
                {formatWei(masterTree.total_team_volume)}
              </span>
            </div>
          </div>
        </div>

        {/* Selected User Profiles Details Section */}
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
          <UserDetailPanel
            node={currentSelectedNode}
            onCenterNode={handleCenterNode}
            rootNode={currentCenterNode}
          />
        </div>
      </div>

      {/* 🍔 Floating Absolute Hamburger Menu Button - Styled with Button Radius 32px */}
      <div className="absolute top-[315px] left-6 z-55 w-[285px]">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`h-11 w-full justify-center px-5 rounded-brand-btn border flex items-center gap-2.5 transition-all active:scale-95 cursor-pointer backdrop-blur-md text-xs font-mono font-bold tracking-wider uppercase shadow-[0_4px_20px_rgba(0,0,0,0.5)] ${isMenuOpen ? "bg-brand-primary/25 border-brand-primary text-white" : "bg-brand-card/95 border-brand-primary/30 text-brand-secondary hover:bg-brand-primary/10 hover:border-brand-secondary"}`}
        >
          <div className="flex flex-col gap-1 w-4 items-end">
            <span className={`h-0.5 bg-current transition-all ${isMenuOpen ? "w-4 rotate-45 translate-y-1" : "w-4"}`} />
            <span className={`h-0.5 bg-current transition-all ${isMenuOpen ? "w-0 opacity-0" : "w-3"}`} />
            <span className={`h-0.5 bg-current transition-all ${isMenuOpen ? "w-4 -rotate-45 -translate-y-1" : "w-2"}`} />
          </div>
          <span>SYSTEM CONTROLS</span>
        </button>
      </div>

      {/* Slide-out Floating Navigation Dashboard drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Dark background backing overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="absolute inset-0 bg-black/55 z-30 cursor-pointer"
            />

            {/* Modular glowing Dashboard card container - Global Radius 20px */}
            <motion.div
              initial={{ opacity: 0, x: -50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -50, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 260, damping: 25 }}
              className="absolute top-20 left-6 z-40 w-[470px] max-h-[80vh] flex flex-col bg-brand-card/98 backdrop-blur-md border border-brand-primary/35 rounded-brand-global shadow-[0_12px_40px_rgba(0,0,0,0.85)] overflow-hidden"
            >
              
              {/* Tabs inside menu */}
              <div className="grid grid-cols-2 text-center text-xs font-bold border-b border-white/5">
                <button
                  onClick={() => setMenuTab("docs")}
                  className={`py-3.5 transition flex items-center justify-center gap-2 ${menuTab === "docs" ? "bg-brand-inner text-brand-secondary border-b-2 border-brand-primary" : "text-gray-400 hover:text-white"}`}
                >
                  <Cpu size={14} />
                  <span>Developer Guide</span>
                </button>
                <button
                  onClick={() => setMenuTab("admin")}
                  className={`py-3.5 transition flex items-center justify-center gap-2 ${menuTab === "admin" ? "bg-brand-inner text-brand-secondary border-b-2 border-brand-primary" : "text-gray-400 hover:text-white"}`}
                >
                  <Layers size={14} />
                  <span>Network Simulator</span>
                </button>
              </div>

              {/* View switch based on active tab */}
              <div className="flex-1 overflow-y-auto p-2 scrollbar-thin bg-brand-card">
                {menuTab === "admin" ? (
                  <div className="p-4 space-y-4">
                    <div className="text-left mb-2">
                      <span className="text-white text-xs font-bold block mb-1">Tree Structure Simulation Panel</span>
                      <span className="text-gray-400 text-[10px] leading-relaxed">
                        Configure various preset dataset structures to demonstrate density handling and proportional radial sector routing on the concentric map. You can also manually attach custom nodes.
                      </span>
                    </div>
                    <Controls
                      currentTree={masterTree}
                      onSelectNode={(node) => setSelectedNodeId(node.userId)}
                      onCenterNode={handleCenterNode}
                      onGenerateRandom={handleGenerateRandomDataset}
                      onAddCustomNode={handleAddCustomNode}
                      selectedNode={currentSelectedNode}
                    />
                  </div>
                ) : (
                  <DeveloperGuide />
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
