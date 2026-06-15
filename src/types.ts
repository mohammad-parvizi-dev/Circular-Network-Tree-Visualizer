/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AvatarFile {
  id: number;
  image: string;
}

export interface AvatarInfo {
  type: string;
  file: AvatarFile | null;
}

export interface UserNode {
  avatar: AvatarInfo | null;
  nickname: string;
  userId: string;
  parent_id: string | null;
  join_date: string;
  level_from_you: number; // 0, 1, 2, 3 relative to root
  rank: string;
  direct_referrals: number;
  total_network_size: number;
  total_team_volume: string; // e.g. "25038385000000000000000000"
  personal_sales_volume: string;
  has_children?: boolean;
  children: UserNode[];
}

export interface LayoutNode {
  node: UserNode;
  x: number;
  y: number;
  angle: number;
  radius: number;
  level: number;
  parentX: number | null;
  parentY: number | null;
  nodeRadius: number;
}

export interface GraphConfig {
  ring1Radius: number;
  ring2Radius: number;
  ring3Radius: number;
  ring4Radius: number;
  nodeSizeLevel0: number;
  nodeSizeLevel1: number;
  nodeSizeLevel2: number;
  nodeSizeLevel3: number;
  nodeSizeLevel4: number;
}
