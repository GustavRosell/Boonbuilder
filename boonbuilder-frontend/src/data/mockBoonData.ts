/**
 * Mock Boon Data for BoonBuilder V2
 *
 * This file provides placeholder data for UI development without backend dependency.
 * Once backend is updated with GodType and non-core boons, replace imports with API calls.
 *
 * Structure:
 * - 22 Gods total (9 Core Olympians + 13 new gods across 3 categories)
 * - Sample non-core boons for each category
 * - Helper functions to filter by god type
 */

import { God, Boon, BoonType, BoonSlot, ElementType } from '../types';

// ============================================================================
// ENUMS
// ============================================================================

/**
 * God categorization matching backend GodType enum
 * Note: These values must match backend enum once implemented
 */
export enum GodType {
  CoreGods = 1,
  NonStandardGods = 2,
  NPCGods = 3,
  Allies = 4
}

/**
 * Extended God interface with type categorization
 */
export interface GodWithType extends God {
  godType: GodType;
}

// ============================================================================
// MOCK GODS (22 Total)
// ============================================================================

/**
 * Core Gods / Olympians (9)
 * These are the standard gods that provide core slot-based boons
 */
export const coreGods: GodWithType[] = [
  {
    godId: 1,
    name: "Aphrodite",
    iconUrl: "/images/boons/Olympian_Gods/aphrodite/other/Aphrodite_Logo.png",
    primaryElement: ElementType.Air,
    secondaryElement: ElementType.Water,
    statusEffect: "Weak",
    description: "Goddess of Love - Grants boons that apply Weak and Charmed",
    godType: GodType.CoreGods
  },
  {
    godId: 2,
    name: "Apollo",
    iconUrl: "/images/boons/Olympian_Gods/apollo/other/Apollo_Logo.png",
    primaryElement: ElementType.Air,
    secondaryElement: ElementType.Fire,
    statusEffect: "Daze",
    description: "God of the Sun - Inflicts Daze, causing enemies to miss attacks",
    godType: GodType.CoreGods
  },
  {
    godId: 3,
    name: "Ares",
    iconUrl: "/images/boons/Olympian_Gods/ares/other/Ares_Logo.png",
    primaryElement: ElementType.Fire,
    secondaryElement: undefined,
    statusEffect: "Wounds",
    description: "God of War - Inflicts Wounds, enhancing raw damage",
    godType: GodType.CoreGods
  },
  {
    godId: 4,
    name: "Demeter",
    iconUrl: "/images/boons/Olympian_Gods/demeter/other/Demeter_Logo.png",
    primaryElement: ElementType.Earth,
    secondaryElement: ElementType.Water,
    statusEffect: "Freeze",
    description: "Goddess of Seasons - Inflicts Freeze and Gust, slowing enemies",
    godType: GodType.CoreGods
  },
  {
    godId: 5,
    name: "Hephaestus",
    iconUrl: "/images/boons/Olympian_Gods/hephaestus/other/Hephaestus_Logo.png",
    primaryElement: ElementType.Earth,
    secondaryElement: ElementType.Fire,
    statusEffect: "Glow",
    description: "God of the Forge - Inflicts Glow, delivering explosive Blast damage",
    godType: GodType.CoreGods
  },
  {
    godId: 6,
    name: "Hera",
    iconUrl: "/images/boons/Olympian_Gods/hera/other/Hera_Logo.png",
    primaryElement: ElementType.Earth,
    secondaryElement: ElementType.Aether,
    statusEffect: "Hitch",
    description: "Queen of Olympus - Inflicts Hitch, spreading damage among enemies",
    godType: GodType.CoreGods
  },
  {
    godId: 7,
    name: "Hestia",
    iconUrl: "/images/boons/Olympian_Gods/hestia/other/Hestia_Logo.png",
    primaryElement: ElementType.Fire,
    secondaryElement: undefined,
    statusEffect: "Scorch",
    description: "Goddess of the Hearth - Inflicts Scorch, a stacking damage-over-time curse",
    godType: GodType.CoreGods
  },
  {
    godId: 8,
    name: "Poseidon",
    iconUrl: "/images/boons/Olympian_Gods/poseidon/other/Poseidon_Logo.png",
    primaryElement: ElementType.Water,
    secondaryElement: ElementType.Aether,
    statusEffect: "Slip",
    description: "God of the Sea - Adds Knockback and inflicts Froth through Splash abilities",
    godType: GodType.CoreGods
  },
  {
    godId: 9,
    name: "Zeus",
    iconUrl: "/images/boons/Olympian_Gods/zeus/other/Zeus_Logo.png",
    primaryElement: ElementType.Air,
    secondaryElement: ElementType.Aether,
    statusEffect: "Blitz",
    description: "King of Olympus - Inflicts Blitz, dealing damage when enemies are hit",
    godType: GodType.CoreGods
  }
];

/**
 * Non-Standard Gods (3)
 * These gods provide unique boons outside the standard Olympian system
 */
export const nonStandardGods: GodWithType[] = [
  {
    godId: 10,
    name: "Chaos",
    iconUrl: "/images/slots/cast.png", // PLACEHOLDER - Update with real icon
    primaryElement: undefined,
    secondaryElement: undefined,
    statusEffect: "None",
    description: "Primordial entity - Grants powerful boons after inflicting temporary debuffs",
    godType: GodType.NonStandardGods
  },
  {
    godId: 11,
    name: "Hermes",
    iconUrl: "/images/slots/sprint.png", // PLACEHOLDER - Update with real icon
    primaryElement: ElementType.Air,
    secondaryElement: undefined,
    statusEffect: "None",
    description: "Messenger God - Increases mobility, speed, evasion, and wealth",
    godType: GodType.NonStandardGods
  },
  {
    godId: 12,
    name: "Selene",
    iconUrl: "/images/slots/magick.png", // PLACEHOLDER - Update with real icon (use Magick slot as temp)
    primaryElement: ElementType.Aether,
    secondaryElement: undefined,
    statusEffect: "None",
    description: "Moon Goddess - Grants Hex boons activated using Magick for powerful effects",
    godType: GodType.NonStandardGods
  }
];

/**
 * NPC Gods (4)
 * Gods that appear occasionally in specific locations to assist
 */
export const npcGods: GodWithType[] = [
  {
    godId: 13,
    name: "Artemis",
    iconUrl: "/images/slots/attack.png", // PLACEHOLDER - Update with real icon
    primaryElement: ElementType.Air,
    secondaryElement: undefined,
    statusEffect: "Marked",
    description: "Goddess of the Hunt - Increases Critical Hit chance and inflicts Marked",
    godType: GodType.NPCGods
  },
  {
    godId: 14,
    name: "Athena",
    iconUrl: "/images/slots/special.png", // PLACEHOLDER - Update with real icon
    primaryElement: ElementType.Aether,
    secondaryElement: undefined,
    statusEffect: "None",
    description: "Goddess of Wisdom - Provides Deflect effects and enhances defensive options",
    godType: GodType.NPCGods
  },
  {
    godId: 15,
    name: "Dionysus",
    iconUrl: "/images/slots/cast.png", // PLACEHOLDER - Update with real icon
    primaryElement: ElementType.Water,
    secondaryElement: undefined,
    statusEffect: "Hangover",
    description: "God of Wine - Inflicts Hangover, generates Festive Fog, boosts survivability",
    godType: GodType.NPCGods
  },
  {
    godId: 16,
    name: "Hades",
    iconUrl: "/images/slots/weapon.webp", // PLACEHOLDER - Update with real icon
    primaryElement: ElementType.Earth,
    secondaryElement: undefined,
    statusEffect: "None",
    description: "God of the Underworld - Provides unique advantages against Chronos",
    godType: GodType.NPCGods
  }
];

/**
 * Allies (6)
 * Non-god characters that provide unique supportive boons
 */
export const allies: GodWithType[] = [
  {
    godId: 17,
    name: "Arachne",
    iconUrl: "/images/slots/familiar.png", // PLACEHOLDER - Update with real icon
    primaryElement: undefined,
    secondaryElement: undefined,
    statusEffect: "None",
    description: "Weaver Ally - Provides Armor and temporary boons active while Armor is intact",
    godType: GodType.Allies
  },
  {
    godId: 18,
    name: "Narcissus",
    iconUrl: "/images/slots/attack.png", // PLACEHOLDER - Update with real icon
    primaryElement: undefined,
    secondaryElement: undefined,
    statusEffect: "None",
    description: "Vain Ally - Offers supplies, rare resources, Boons, or Death Defiance refills",
    godType: GodType.Allies
  },
  {
    godId: 19,
    name: "Echo",
    iconUrl: "/images/slots/special.png", // PLACEHOLDER - Update with real icon
    primaryElement: undefined,
    secondaryElement: undefined,
    statusEffect: "None",
    description: "Nymph Ally - Provides boons that duplicate previously received rewards",
    godType: GodType.Allies
  },
  {
    godId: 20,
    name: "Medea",
    iconUrl: "/images/slots/cast.png", // PLACEHOLDER - Update with real icon
    primaryElement: undefined,
    secondaryElement: undefined,
    statusEffect: "Curse",
    description: "Sorceress Ally - Provides curse-based boons that weaken foes or deal damage over time",
    godType: GodType.Allies
  },
  {
    godId: 21,
    name: "Circe",
    iconUrl: "/images/slots/sprint.png", // PLACEHOLDER - Update with real icon
    primaryElement: undefined,
    secondaryElement: undefined,
    statusEffect: "None",
    description: "Witch Ally - Provides boons related to witchcraft, transformation, and Arcana Card activation",
    godType: GodType.Allies
  },
  {
    godId: 22,
    name: "Icarus",
    iconUrl: "/images/slots/weapon.webp", // PLACEHOLDER - Update with real icon
    primaryElement: undefined,
    secondaryElement: undefined,
    statusEffect: "None",
    description: "Winged Ally - Grants Armor, increases Power, and provides supportive supplies",
    godType: GodType.Allies
  }
];

/**
 * All gods combined (22 total)
 */
export const mockGods: GodWithType[] = [
  ...coreGods,
  ...nonStandardGods,
  ...npcGods,
  ...allies
];

// ============================================================================
// MOCK NON-CORE BOONS
// ============================================================================

/**
 * Sample non-core boons for each god category
 * These are placeholders - real data will come from user and BoonSeeder
 */
export const mockNonCoreBoons: Boon[] = [
  // ===== CHAOS BOONS (GodId 10) =====
  {
    boonId: 500,
    name: "Strike Flourish",
    type: BoonType.Chaos,
    godId: 10,
    slot: undefined,
    description: "Your Strike and Flourish deal more damage, but you take damage from traps",
    effect: "+40% Attack/Special Damage, +30% Trap Damage Taken for 3 encounters",
    iconUrl: "/images/slots/attack.png", // PLACEHOLDER
    element: undefined,
    statusEffect: "",
    isPassive: false,
    god: nonStandardGods[0]
  },
  {
    boonId: 501,
    name: "Defiance",
    type: BoonType.Chaos,
    godId: 10,
    slot: undefined,
    description: "Gain extra Death Defiance, but take more damage",
    effect: "+1 Death Defiance, +20% Damage Taken for 4 encounters",
    iconUrl: "/images/slots/special.png", // PLACEHOLDER
    element: undefined,
    statusEffect: "",
    isPassive: false,
    god: nonStandardGods[0]
  },

  // ===== HERMES BOONS (GodId 11) =====
  {
    boonId: 502,
    name: "Greatest Reflex",
    type: BoonType.Godsent,
    godId: 11,
    slot: undefined,
    description: "You move significantly faster",
    effect: "+20% Movement Speed",
    iconUrl: "/images/slots/sprint.png", // PLACEHOLDER
    element: ElementType.Air,
    statusEffect: "",
    isPassive: true,
    god: nonStandardGods[1]
  },
  {
    boonId: 503,
    name: "Swift Strike",
    type: BoonType.Godsent,
    godId: 11,
    slot: undefined,
    description: "Your Attack is faster",
    effect: "+30% Attack Speed",
    iconUrl: "/images/slots/attack.png", // PLACEHOLDER
    element: ElementType.Air,
    statusEffect: "",
    isPassive: true,
    god: nonStandardGods[1]
  },

  // ===== SELENE HEX BOONS (GodId 12) =====
  {
    boonId: 504,
    name: "Moonlight Hex",
    type: BoonType.Hex,
    godId: 12,
    slot: undefined,
    description: "Activate with Magick to deal massive damage to nearby foes",
    effect: "300 damage to nearby enemies when activated",
    iconUrl: "/images/slots/magick.png", // PLACEHOLDER
    element: ElementType.Aether,
    statusEffect: "",
    isPassive: false,
    god: nonStandardGods[2]
  },
  {
    boonId: 505,
    name: "Lunar Ray Hex",
    type: BoonType.Hex,
    godId: 12,
    slot: undefined,
    description: "Activate with Magick to fire a powerful beam that pierces enemies",
    effect: "500 damage beam when activated",
    iconUrl: "/images/slots/cast.png", // PLACEHOLDER
    element: ElementType.Aether,
    statusEffect: "",
    isPassive: false,
    god: nonStandardGods[2]
  },

  // ===== ARTEMIS BOONS (GodId 13) =====
  {
    boonId: 506,
    name: "Critical Precision",
    type: BoonType.Godsent,
    godId: 13,
    slot: undefined,
    description: "Your Critical Hit chance is increased",
    effect: "+15% Critical Chance",
    iconUrl: "/images/slots/attack.png", // PLACEHOLDER
    element: ElementType.Air,
    statusEffect: "Marked",
    isPassive: true,
    god: npcGods[0]
  },

  // ===== ATHENA BOONS (GodId 14) =====
  {
    boonId: 507,
    name: "Divine Protection",
    type: BoonType.Godsent,
    godId: 14,
    slot: undefined,
    description: "You take less damage from all sources",
    effect: "-20% Damage Taken",
    iconUrl: "/images/slots/special.png", // PLACEHOLDER
    element: ElementType.Aether,
    statusEffect: "",
    isPassive: true,
    god: npcGods[1]
  },

  // ===== DIONYSUS BOONS (GodId 15) =====
  {
    boonId: 508,
    name: "Festive Haze",
    type: BoonType.Godsent,
    godId: 15,
    slot: undefined,
    description: "Generate Festive Fog that slows enemies",
    effect: "Festive Fog slows enemies by 30%",
    iconUrl: "/images/slots/cast.png", // PLACEHOLDER
    element: ElementType.Water,
    statusEffect: "Hangover",
    isPassive: true,
    god: npcGods[2]
  },

  // ===== HADES BOONS (GodId 16) =====
  {
    boonId: 509,
    name: "Father's Blessing",
    type: BoonType.Godsent,
    godId: 16,
    slot: undefined,
    description: "Deal bonus damage to Chronos",
    effect: "+50% Damage vs Chronos",
    iconUrl: "/images/slots/weapon.webp", // PLACEHOLDER
    element: ElementType.Earth,
    statusEffect: "",
    isPassive: true,
    god: npcGods[3]
  },

  // ===== ARACHNE BOONS (GodId 17) =====
  {
    boonId: 510,
    name: "Silk Armor",
    type: BoonType.Godsent,
    godId: 17,
    slot: undefined,
    description: "Gain Armor that provides temporary protection",
    effect: "+50 Armor (boons active while Armor intact)",
    iconUrl: "/images/slots/familiar.png", // PLACEHOLDER
    element: undefined,
    statusEffect: "",
    isPassive: false,
    god: allies[0]
  },

  // ===== NARCISSUS BOONS (GodId 18) =====
  {
    boonId: 511,
    name: "Vain Generosity",
    type: BoonType.Godsent,
    godId: 18,
    slot: undefined,
    description: "Receive additional rewards after encounters",
    effect: "+20% Rewards from Encounters",
    iconUrl: "/images/slots/attack.png", // PLACEHOLDER
    element: undefined,
    statusEffect: "",
    isPassive: true,
    god: allies[1]
  },

  // ===== ECHO BOONS (GodId 19) =====
  {
    boonId: 512,
    name: "Echo's Reflection",
    type: BoonType.Godsent,
    godId: 19,
    slot: undefined,
    description: "Duplicate rewards from previous room",
    effect: "Duplicates last reward received",
    iconUrl: "/images/slots/special.png", // PLACEHOLDER
    element: undefined,
    statusEffect: "",
    isPassive: false,
    god: allies[2]
  },

  // ===== MEDEA BOONS (GodId 20) =====
  {
    boonId: 513,
    name: "Witch's Curse",
    type: BoonType.Godsent,
    godId: 20,
    slot: undefined,
    description: "Enemies are cursed, taking damage over time",
    effect: "30 damage/sec for 8 seconds",
    iconUrl: "/images/slots/cast.png", // PLACEHOLDER
    element: undefined,
    statusEffect: "Curse",
    isPassive: false,
    god: allies[3]
  },

  // ===== CIRCE BOONS (GodId 21) =====
  {
    boonId: 514,
    name: "Arcane Activation",
    type: BoonType.Godsent,
    godId: 21,
    slot: undefined,
    description: "Automatically activate your next Arcana Card",
    effect: "Activates next Arcana Card for free",
    iconUrl: "/images/slots/sprint.png", // PLACEHOLDER
    element: undefined,
    statusEffect: "",
    isPassive: false,
    god: allies[4]
  },

  // ===== ICARUS BOONS (GodId 22) =====
  {
    boonId: 515,
    name: "Wax Wings",
    type: BoonType.Godsent,
    godId: 22,
    slot: undefined,
    description: "Gain Armor and increased Power for the night",
    effect: "+30 Armor, +10% Power",
    iconUrl: "/images/slots/weapon.webp", // PLACEHOLDER
    element: undefined,
    statusEffect: "",
    isPassive: true,
    god: allies[5]
  }
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get gods filtered by type
 */
export const getGodsByType = (godType: GodType): GodWithType[] => {
  return mockGods.filter(g => g.godType === godType);
};

/**
 * Get all core gods (Olympians)
 */
export const getCoreGods = (): GodWithType[] => {
  return getGodsByType(GodType.CoreGods);
};

/**
 * Get all non-standard gods (Chaos, Hermes, Selene)
 */
export const getNonStandardGods = (): GodWithType[] => {
  return getGodsByType(GodType.NonStandardGods);
};

/**
 * Get all NPC gods
 */
export const getNPCGods = (): GodWithType[] => {
  return getGodsByType(GodType.NPCGods);
};

/**
 * Get all allies
 */
export const getAllies = (): GodWithType[] => {
  return getGodsByType(GodType.Allies);
};

/**
 * Get non-core boons for a specific god
 */
export const getNonCoreBoonsForGod = (godId: number): Boon[] => {
  return mockNonCoreBoons.filter(b => b.godId === godId);
};

/**
 * Get non-core boons by type
 */
export const getNonCoreBoonsByType = (boonType: BoonType): Boon[] => {
  return mockNonCoreBoons.filter(b => b.type === boonType);
};

/**
 * Get all Chaos boons
 */
export const getChaosBoons = (): Boon[] => {
  return getNonCoreBoonsByType(BoonType.Chaos);
};

/**
 * Get all Hex boons (Selene)
 */
export const getHexBoons = (): Boon[] => {
  return getNonCoreBoonsByType(BoonType.Hex);
};

/**
 * Get all Godsent boons (NPC + Allies)
 */
export const getGodsentBoons = (): Boon[] => {
  return getNonCoreBoonsByType(BoonType.Godsent);
};

// ============================================================================
// EXPORT SUMMARY
// ============================================================================

export default {
  // Gods by category
  coreGods,
  nonStandardGods,
  npcGods,
  allies,
  mockGods,

  // Boons
  mockNonCoreBoons,

  // Helper functions
  getGodsByType,
  getCoreGods,
  getNonStandardGods,
  getNPCGods,
  getAllies,
  getNonCoreBoonsForGod,
  getNonCoreBoonsByType,
  getChaosBoons,
  getHexBoons,
  getGodsentBoons
};
