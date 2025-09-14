// Enums matching backend
export enum ElementType {
  Fire = 0,
  Water = 1,
  Earth = 2,
  Air = 3,
  Aether = 4
}

export enum BoonType {
  Core = 0,
  Duo = 1,
  Legendary = 2,
  Infusion = 3,
  Hex = 4,
  Chaos = 5
}

export enum BoonSlot {
  Attack = 0,
  Special = 1,
  Cast = 2,
  Sprint = 3,
  Magick = 4
}

export enum WeaponType {
  WitchStaff = 0,
  SisterBlades = 1,
  UmbralFlames = 2,
  MoonstoneAxe = 3,
  ArgentSkull = 4,
  BlackCoat = 5
}

export enum BuildTier {
  S = 0,
  A = 1,
  B = 2,
  C = 3,
  D = 4
}

export enum BuildDifficulty {
  Easy = 0,
  Medium = 1,
  Hard = 2,
  Expert = 3
}

// Core interfaces matching backend models
export interface God {
  godId: number;
  name: string;
  iconUrl: string;
  primaryElement: ElementType;
  secondaryElement?: ElementType;
  statusEffect: string;
  description: string;
}

export interface Boon {
  boonId: number;
  name: string;
  type: BoonType;
  godId?: number;
  slot?: BoonSlot;
  description: string;
  effect: string;
  iconUrl: string;
  element?: ElementType;
  statusEffect?: string;
  isPassive: boolean;
  god?: God;
}

export interface DuoBoon extends Boon {
  firstGodId: number;
  secondGodId: number;
  firstGod: God;
  secondGod: God;
}

export interface WeaponAspect {
  aspectId: number;
  weaponId: number;
  name: string;
  iconUrl: string;
  description: string;
  isHidden: boolean;
}

export interface Weapon {
  weaponId: number;
  type: WeaponType;
  name: string;
  iconUrl: string;
  description: string;
  aspects: WeaponAspect[];
}

export interface Build {
  buildId: number;
  name: string;
  description: string;
  authorId: string;
  weaponAspectId: number;
  difficulty: BuildDifficulty;
  tier: BuildTier;
  isFeatured: boolean;
  isPublic: boolean;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
  playstyleTags: string;
  author?: any;
  weaponAspect?: WeaponAspect;
  buildBoons?: BuildBoon[];
}

export interface BuildBoon {
  buildBoonId: number;
  buildId: number;
  boonId: number;
  slot?: BoonSlot;
  order: number;
  boon?: Boon;
}

// Authentication types
export interface UserInfo {
  id: string;
  username: string;
  email: string;
  displayName: string;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: UserInfo;
  token?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  displayName: string;
}

// UI specific types
export interface RadialMenuItem {
  id: string;
  name: string;
  icon?: string;
  iconUrl?: string;
  angle?: number;
  isHovered?: boolean;
}

export interface BuildState {
  weapon?: Weapon;
  aspect?: WeaponAspect;
  boons: Map<BoonSlot, Boon>;
  name: string;
  description: string;
}