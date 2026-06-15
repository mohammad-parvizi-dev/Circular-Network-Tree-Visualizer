/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserNode } from "./types";

// User's exact initial tree data from the request prompt
const RAW_INITIAL_TREE_DATA: UserNode[] = [
  {
    "avatar": {
      "type": "STATIC",
      "file": {
        "id": 0,
        "image": "https://api.web3hub.pro/static/2.jpg"
      }
    },
    "nickname": "web3hub",
    "userId": "0xW3HTOV#x02042",
    "parent_id": "0xW3HLTX#x08227",
    "join_date": "2025-02-10T19:14:56.575298Z",
    "level_from_you": 0,
    "rank": "Citizens",
    "direct_referrals": 2,
    "total_network_size": 10140,
    "total_team_volume": "25038385000000000000000000",
    "personal_sales_volume": "0",
    "children": [
      {
        "avatar": {
          "type": "STATIC",
          "file": {
            "id": 0,
            "image": "https://api.web3hub.pro/static/2.jpg"
          }
        },
        "nickname": "alpharency",
        "userId": "0xW3HMUA#x07741",
        "parent_id": "0xW3HTOV#x02042",
        "join_date": "2025-02-10T21:05:12.102862Z",
        "level_from_you": 1,
        "rank": "Consultants",
        "direct_referrals": 2,
        "total_network_size": 10137,
        "personal_sales_volume": "1000000000000000000000",
        "total_team_volume": "24787385000000000000000000",
        "has_children": true,
        "children": [
          {
            "avatar": {
              "type": "STATIC",
              "file": {
                "id": 15,
                "image": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=60"
              }
            },
            "nickname": "alpha-1",
            "userId": "0xW3HXPH#x05035",
            "parent_id": "0xW3HMUA#x07741",
            "join_date": "2025-02-10T21:23:12.145790Z",
            "level_from_you": 2,
            "rank": "Sales Associates",
            "direct_referrals": 2,
            "total_network_size": 1468,
            "personal_sales_volume": "0",
            "total_team_volume": "3929180000000000000000000",
            "has_children": true,
            "children": [
              {
                "avatar": {
                  "type": "STATIC",
                  "file": {
                    "id": 9,
                    "image": "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=150&auto=format&fit=crop&q=60"
                  }
                },
                "nickname": "phoneix",
                "userId": "0xW3HRON#x04849",
                "parent_id": "0xW3HXPH#x05035",
                "join_date": "2025-02-10T21:27:08.621856Z",
                "level_from_you": 3,
                "rank": "Agents",
                "direct_referrals": 2,
                "total_network_size": 746,
                "personal_sales_volume": "5000000000000000000000",
                "total_team_volume": "2127120000000000000000000",
                "has_children": true,
                "children": []
              },
              {
                "avatar": null,
                "nickname": "web3sunceo",
                "userId": "0xW3HYIO#x09154",
                "parent_id": "0xW3HXPH#x05035",
                "join_date": "2025-02-10T21:31:57.652571Z",
                "level_from_you": 3,
                "rank": "Agents",
                "direct_referrals": 5,
                "total_network_size": 720,
                "personal_sales_volume": "1000000000000000000000",
                "total_team_volume": "1801060000000000000000000",
                "has_children": true,
                "children": []
              }
            ]
          },
          {
            "avatar": {
              "type": "STATIC",
              "file": {
                "id": 8,
                "image": "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=150&auto=format&fit=crop&q=60"
              }
            },
            "nickname": "alpha-2",
            "userId": "0xW3HZBU#x06424",
            "parent_id": "0xW3HMUA#x07741",
            "join_date": "2025-02-10T21:28:06.014575Z",
            "level_from_you": 2,
            "rank": "Citizens",
            "direct_referrals": 2,
            "total_network_size": 8667,
            "personal_sales_volume": "0",
            "total_team_volume": "20750255000000000000000000",
            "has_children": true,
            "children": [
              {
                "avatar": {
                  "type": "STATIC",
                  "file": {
                    "id": 75,
                    "image": "https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=150&auto=format&fit=crop&q=60"
                  }
                },
                "nickname": "movangaurd",
                "userId": "0xW3HRVY#x06273",
                "parent_id": "0xW3HZBU#x06424",
                "join_date": "2025-02-10T21:33:19.369878Z",
                "level_from_you": 3,
                "rank": "Mentors",
                "direct_referrals": 2,
                "total_network_size": 8663,
                "personal_sales_volume": "0",
                "total_team_volume": "20741255000000000000000000",
                "has_children": true,
                "children": []
              },
              {
                "avatar": {
                  "type": "STATIC",
                  "file": {
                    "id": 8,
                    "image": "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=150&auto=format&fit=crop&q=60"
                  }
                },
                "nickname": "xmind",
                "userId": "0xW3HEAM#x01511",
                "parent_id": "0xW3HZBU#x06424",
                "join_date": "2025-02-20T16:02:41.072157Z",
                "level_from_you": 3,
                "rank": "Citizens",
                "direct_referrals": 2,
                "total_network_size": 2,
                "personal_sales_volume": "0",
                "total_team_volume": "5000000000000000000000",
                "has_children": true,
                "children": []
              }
            ]
          }
        ]
      },
      {
        "avatar": {
          "type": "STATIC",
          "file": {
            "id": 22,
            "image": "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=150&auto=format&fit=crop&q=60"
          }
        },
        "nickname": "web3hubpro",
        "userId": "0xW3HGVC#x06965",
        "parent_id": "0xW3HTOV#x02042",
        "join_date": "2025-02-13T18:54:52.770201Z",
        "level_from_you": 1,
        "rank": "Citizens",
        "direct_referrals": 1,
        "total_network_size": 1,
        "personal_sales_volume": "0",
        "total_team_volume": "2000000000000000000000",
        "has_children": true,
        "children": [
          {
            "avatar": {
              "type": "STATIC",
              "file": {
                "id": 0,
                "image": "https://api.web3hub.pro/static/2.jpg"
              }
            },
            "nickname": "alpharency-pro",
            "userId": "0xW3HEYH#x02958",
            "parent_id": "0xW3HGVC#x06965",
            "join_date": "2026-05-11T10:00:26.161383Z",
            "level_from_you": 2,
            "rank": "Citizens",
            "direct_referrals": 0,
            "total_network_size": 0,
            "personal_sales_volume": "0",
            "total_team_volume": "1000000000000000000000",
            "has_children": false,
            "children": []
          }
        ]
      }
    ]
  }
];

// List of cool web3-themed Unsplash images for rich avatars
const COOL_AVATARS = [
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=150&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=150&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=150&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=150&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=150&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=150&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=150&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1617791160505-6f006e121980?w=150&auto=format&fit=crop&q=60"
];

const WEB3_NICKNAMES = [
  "omega-staker", "solargazer", "quantum_core", "cryptolion", "dexmaster", "ether_shielder", "neon_phantom", "web3sun",
  "cyber_titan", "hologram_z", "orbit_miner", "polaris_fund", "stardust_dao", "nebula_ceo", "vortex_nodes", "pulse_rider",
  "shadow_ledger", "aurora_yield", "defi_nomad", "zenith_node", "glitch_hunter", "matrix_pilot", "flux_broker", "atlas_token"
];

const RANKS = ["Citizens", "Agents", "Sales Associates", "Mentors", "Consultants", "Ambassadors", "Presidents"];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateRandomHexId(): string {
  const chars = "0123456789ABCDEF";
  let hash1 = "";
  let hash2 = "";
  for (let i = 0; i < 6; i++) {
    hash1 += chars[Math.floor(Math.random() * 16)];
    hash2 += chars[Math.floor(Math.random() * 10)]; // simpler digits for #x
  }
  return `0xW3H${hash1}#x0${hash2}`;
}

// Generate team volume in Wei (e.g., matching the user's very large exponential scale)
function generateRandomVolume(level: number): string {
  const basePower = 24 - level * 3; // higher levels have less volume
  if (basePower <= 0) return "0";
  const num = Math.floor(Math.random() * 900) + 100; // 100 to 999
  return `${num}${"0".repeat(basePower - 3)}`;
}

/**
 * Recursively generates a mock tree matching the original API structure with beautiful organic branching.
 */
export function generateMockTree(
  nickname: string = "root-staker",
  depth: number = 4,
  branchCountRange: [number, number] = [2, 4],
  levelFromYou: number = 0,
  parentId: string | null = null
): UserNode {
  const userId = generateRandomHexId();
  
  // High-fidelity asymmetrical branch continuation probabilities:
  // Level 0 always branches.
  // Level 1 has an 80% chance to branches.
  // Level 2 has a 60% chance to branches (40% stop here, creating 2-level paths).
  // Level 3 has a 45% chance to branch to level 4 (55% stop here).
  let shouldHaveChildren = true;
  if (levelFromYou > 0) {
    const roll = Math.random();
    if (levelFromYou === 1) {
      shouldHaveChildren = roll < 0.80;
    } else if (levelFromYou === 2) {
      shouldHaveChildren = roll < 0.60;
    } else if (levelFromYou === 3) {
      shouldHaveChildren = roll < 0.45;
    } else {
      shouldHaveChildren = false; // Level 4 is max
    }
  }

  // Determine children count using randomized branching bounds
  let numChildren = 0;
  if (shouldHaveChildren && levelFromYou < depth) {
    let minVal = branchCountRange[0];
    let maxVal = branchCountRange[1];

    if (levelFromYou === 0) {
      if (maxVal === 2) {
        minVal = 2;
        maxVal = 5;
      } else if (maxVal === 3) {
        minVal = 4;
        maxVal = 8;
      } else if (maxVal >= 4) {
        minVal = 6;
        maxVal = 12;
      } else {
        maxVal = Math.max(maxVal, 8);
      }
    }

    // To allow some branches to be slender (e.g. 1 user) even on wide presets,
    // we make the lower bound flexible.
    const lowerBound = levelFromYou === 0 ? minVal : Math.max(1, minVal - 1);
    numChildren = Math.floor(Math.random() * (maxVal - lowerBound + 1)) + lowerBound;
  }
  
  const children: UserNode[] = [];
  const currentNicknames = [...WEB3_NICKNAMES];
  
  const directRefs = levelFromYou < depth ? numChildren : Math.floor(Math.random() * 5);

  const hasAvatar = Math.random() > 0.15; // 15% chance of null avatar
  const avatarUrl = hasAvatar ? getRandomElement(COOL_AVATARS) : null;
  const avatarFileId = Math.floor(Math.random() * 100);

  const node: UserNode = {
    avatar: avatarUrl ? {
      type: "STATIC",
      file: {
        id: avatarFileId,
        image: avatarUrl
      }
    } : null,
    nickname,
    userId,
    parent_id: parentId,
    join_date: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 365).toISOString(),
    level_from_you: levelFromYou,
    rank: getRandomElement(RANKS),
    direct_referrals: directRefs,
    total_network_size: 0, // calculated later
    total_team_volume: "0", // calculated later
    personal_sales_volume: Math.random() > 0.5 ? `${Math.floor(Math.random() * 10) * 1000}000000000000000000` : "0",
    has_children: numChildren > 0,
    children: []
  };

  if (numChildren > 0 && levelFromYou < depth) {
    for (let i = 0; i < numChildren; i++) {
      const childNick = getRandomElement(currentNicknames) + `-${Math.floor(Math.random() * 9) + 1}`;
      children.push(generateMockTree(childNick, depth, branchCountRange, levelFromYou + 1, userId));
    }
  }

  node.children = children;

  // Calculate totals recursively
  let networkSize = children.length;
  children.forEach(c => {
    networkSize += c.total_network_size;
  });
  node.total_network_size = networkSize;
  
  // Create beautiful pseudo volumes
  node.total_team_volume = generateRandomVolume(levelFromYou);

  return node;
}

/**
 * Deep search a user node in the tree by its ID.
 */
export function findUserNodeById(root: UserNode, userId: string): UserNode | null {
  if (root.userId === userId) return root;
  for (const child of root.children) {
    const found = findUserNodeById(child, userId);
    if (found) return found;
  }
  return null;
}

/**
 * Computes lineage path (sequence of ancestors) from root to target userId.
 * Helpful for breadcrumbs and navigation.
 */
export function findNodeLineage(root: UserNode, userId: string): UserNode[] | null {
  if (root.userId === userId) return [root];
  for (const child of root.children) {
    const path = findNodeLineage(child, userId);
    if (path) {
      return [root, ...path];
    }
  }
  return null;
}

/**
 * Re-indexes tree levels relative to a new core node (which becomes level 0).
 * Deep copies the subtree and sets levels.
 */
export function extractSubtreeAsRoot(node: UserNode): UserNode {
  const clone = JSON.parse(JSON.stringify(node)) as UserNode;
  
  function reindex(curr: UserNode, lvl: number) {
    curr.level_from_you = lvl;
    curr.children.forEach(c => reindex(c, lvl + 1));
  }
  
  reindex(clone, 0);
  return clone;
}

/**
 * Ensures any Level 3 node without children has a set of randomly generated Level 4 children,
 * and recursively updates counts.
 */
export function ensureTreeHasFourLevels(node: UserNode): UserNode {
  function traverse(curr: UserNode) {
    if (curr.level_from_you === 3) {
      if (!curr.children || curr.children.length === 0) {
        // Roll 50% probability to branch into level 4
        const shouldPopulateL4 = Math.random() < 0.50;
        if (shouldPopulateL4) {
          const numChildren = Math.floor(Math.random() * 3) + 1;
          const children: UserNode[] = [];
          for (let i = 0; i < numChildren; i++) {
            const childNick = getRandomElement(WEB3_NICKNAMES) + `-${Math.floor(Math.random() * 9) + 1}`;
            const childId = generateRandomHexId();
            children.push({
              avatar: Math.random() > 0.15 ? {
                type: "STATIC",
                file: {
                  id: Math.floor(Math.random() * 100),
                  image: getRandomElement(COOL_AVATARS)
                }
              } : null,
              nickname: childNick,
              userId: childId,
              parent_id: curr.userId,
              join_date: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 365).toISOString(),
              level_from_you: 4,
              rank: getRandomElement(RANKS),
              direct_referrals: 0,
              total_network_size: 0,
              total_team_volume: generateRandomVolume(4),
              personal_sales_volume: Math.random() > 0.5 ? `${Math.floor(Math.random() * 10) * 1000}000000000000000000` : "0",
              children: [],
            });
          }
          curr.children = children;
          curr.direct_referrals = numChildren;
          curr.has_children = true;
        }
      }
    } else {
      curr.children.forEach(traverse);
    }
  }

  const clone = JSON.parse(JSON.stringify(node)) as UserNode;
  traverse(clone);

  // Recalculate total_network_size upward
  function recalc(curr: UserNode): number {
    let size = curr.children.length;
    curr.children.forEach(c => {
      size += recalc(c);
    });
    curr.total_network_size = size;
    return size;
  }
  recalc(clone);

  return clone;
}

export const INITIAL_TREE_DATA: UserNode[] = [
  ensureTreeHasFourLevels(RAW_INITIAL_TREE_DATA[0])
];
