/**
 * Mock Keepsakes Data
 *
 * Keepsakes are items that can be equipped to obtain benefits during a run.
 * They are acquired by giving Nectar to various characters for the first time.
 * Each keepsake can be ranked up (Ranks 1-3, plus Heroic with Cherished Heirloom duo boon).
 */

// ============================================================================
// INTERFACES
// ============================================================================

export interface Keepsake {
  keepsakeId: number;
  name: string;
  iconUrl: string;
  fromCharacter: string;
  description: string;
  category: KeepsakeCategory;

  // Rank effects
  rank1Effect: string;
  rank2Effect: string;
  rank3Effect: string;
  heroicEffect?: string;

  bondMessage?: string;
  notes?: string;
}

export enum KeepsakeCategory {
  Companion = 'Companion',
  Olympian = 'Olympian',
  NPC = 'NPC',
  Ally = 'Ally',
  Special = 'Special'
}

// ============================================================================
// MOCK DATA
// ============================================================================

export const mockKeepsakes: Keepsake[] = [
  // Companions & NPCs
  {
    keepsakeId: 1,
    name: 'Silver Wheel',
    iconUrl: '/images/keepsakes/Silver_Wheel.webp',
    fromCharacter: 'Hecate',
    description: 'Gain bonus Magick this night.',
    category: KeepsakeCategory.Companion,
    rank1Effect: 'Gain +50 Magick',
    rank2Effect: 'Gain +75 Magick',
    rank3Effect: 'Gain +100 Magick',
    heroicEffect: 'Gain +150 Magick',
    bondMessage: 'At each crossroads, listen, and she shall ensure the pathway forward is revealed.',
    notes: 'The Magick granted remains active even if unequipped.'
  },
  {
    keepsakeId: 2,
    name: 'Knuckle Bones',
    iconUrl: '/images/keepsakes/Knuckle_Bones.webp',
    fromCharacter: 'Odysseus',
    description: 'The next Guardian loses Health. You take less damage from Guardians.',
    category: KeepsakeCategory.Companion,
    rank1Effect: 'Guardian -5% Health, -10% damage from Guardians',
    rank2Effect: 'Guardian -10% Health, -10% damage from Guardians',
    rank3Effect: 'Guardian -15% Health, -10% damage from Guardians',
    heroicEffect: 'Guardian -25% Health, -10% damage from Guardians',
    bondMessage: 'Few know the ways and hearts of gods and mortals to the same extent.',
    notes: 'Effect limited to 1 region, expires after defeating Guardian.'
  },
  {
    keepsakeId: 3,
    name: 'Luckier Tooth',
    iconUrl: '/images/keepsakes/Luckier_Tooth.webp',
    fromCharacter: 'Schelemeus',
    description: 'After you fall to 0 Health, automatically restore Health once this night.',
    category: KeepsakeCategory.Companion,
    rank1Effect: 'Restore 51 Health',
    rank2Effect: 'Restore 76 Health',
    rank3Effect: 'Restore 101 Health',
    heroicEffect: 'Restore 151 Health',
    bondMessage: 'Who taught the noble Phoenix to rise from its ashes following its death?',
    notes: 'Functions as a bonus Death Defiance.'
  },
  {
    keepsakeId: 4,
    name: 'Ghost Onion',
    iconUrl: '/images/keepsakes/Ghost_Onion.webp',
    fromCharacter: 'Dora',
    description: 'Whenever you exit a Location, fully restore your Health up to a total limit.',
    category: KeepsakeCategory.Companion,
    rank1Effect: 'Restore up to 50 Health total',
    rank2Effect: 'Restore up to 75 Health total',
    rank3Effect: 'Restore up to 100 Health total',
    heroicEffect: 'Restore up to 150 Health total',
    bondMessage: 'Purpose is what we make of it, and therein lies our Hope, however much remains.'
  },
  {
    keepsakeId: 5,
    name: 'Evil Eye',
    iconUrl: '/images/keepsakes/Evil_Eye.webp',
    fromCharacter: 'Nemesis',
    description: 'Deal bonus damage to the last foe that vanquished you.',
    category: KeepsakeCategory.Companion,
    rank1Effect: '+20% damage',
    rank2Effect: '+25% damage',
    rank3Effect: '+30% damage',
    heroicEffect: '+40% damage',
    bondMessage: 'When it comes to Retribution, having just enough can be more than enough.'
  },
  {
    keepsakeId: 6,
    name: 'Gold Purse',
    iconUrl: '/images/keepsakes/Gold_Purse.webp',
    fromCharacter: 'Charon',
    description: 'Gain bonus Gold this night.',
    category: KeepsakeCategory.Companion,
    rank1Effect: 'Gain +100 Gold',
    rank2Effect: 'Gain +125 Gold',
    rank3Effect: 'Gain +150 Gold',
    heroicEffect: 'Gain +200 Gold',
    bondMessage: 'True and complete trust does not require words to be exchanged.'
  },
  {
    keepsakeId: 7,
    name: 'Engraved Pin',
    iconUrl: '/images/keepsakes/Engraved_Pin.webp',
    fromCharacter: 'Moros',
    description: 'When first you fall to 0 Health, become Doomed. Clear it in time for Health.',
    category: KeepsakeCategory.Companion,
    rank1Effect: 'Restore 30 Health if cleared',
    rank2Effect: 'Restore 45 Health if cleared',
    rank3Effect: 'Restore 60 Health if cleared',
    heroicEffect: 'Restore 90 Health if cleared',
    bondMessage: 'Doom is by nature preordained; yet to fight for our desires is in our nature, too.',
    notes: 'Doomed: Invulnerable for 10 Sec, but still at 0 Health afterward.'
  },
  {
    keepsakeId: 8,
    name: 'Discordant Bell',
    iconUrl: '/images/keepsakes/Discordant_Bell.webp',
    fromCharacter: 'Eris',
    description: 'After each Encounter, deal more damage but also take more.',
    category: KeepsakeCategory.Companion,
    rank1Effect: '+0.5% damage and damage taken per encounter',
    rank2Effect: '+0.75% damage and damage taken per encounter',
    rank3Effect: '+1% damage and damage taken per encounter',
    heroicEffect: '+1.5% damage and damage taken per encounter',
    bondMessage: 'Strife may have no place in a world more ideal than ours, but ours is all we have.',
    notes: 'Remains active even if unequipped.'
  },
  {
    keepsakeId: 9,
    name: 'Blackened Fleece',
    iconUrl: '/images/keepsakes/Blackened_Fleece.webp',
    fromCharacter: 'Unknown',
    description: 'Gain Armor whenever you enter a Location.',
    category: KeepsakeCategory.Companion,
    rank1Effect: 'Gain 1 Armor',
    rank2Effect: 'Gain 2 Armor',
    rank3Effect: 'Gain 3 Armor',
    heroicEffect: 'Gain 4 Armor',
    bondMessage: 'Protection earned through trials faced together.'
  },

  // Olympian Keepsakes
  {
    keepsakeId: 20,
    name: 'Cloud Bangle',
    iconUrl: '/images/keepsakes/Cloud_Bangle.webp',
    fromCharacter: 'Zeus',
    description: 'A Boon of Zeus is likely. You can Rarify his blessings once this night.',
    category: KeepsakeCategory.Olympian,
    rank1Effect: 'Rarify Common blessings',
    rank2Effect: 'Rarify Rare blessings',
    rank3Effect: 'Rarify Epic blessings',
    heroicEffect: 'Rarify Heroic blessings',
    bondMessage: 'To reign in the heavens takes more than a king, but the family by his side.'
  },
  {
    keepsakeId: 21,
    name: 'Iridescent Fan',
    iconUrl: '/images/keepsakes/Iridescent_Fan.webp',
    fromCharacter: 'Hera',
    description: 'A Boon of Hera is likely. You can Rarify her blessings once this night.',
    category: KeepsakeCategory.Olympian,
    rank1Effect: 'Rarify Common blessings',
    rank2Effect: 'Rarify Rare blessings',
    rank3Effect: 'Rarify Epic blessings',
    heroicEffect: 'Rarify Heroic blessings',
    bondMessage: 'The queen seldom shares her burdens, loath as she is to trust without good cause.'
  },
  {
    keepsakeId: 22,
    name: 'Vivid Sea',
    iconUrl: '/images/keepsakes/Vivid_Sea.webp',
    fromCharacter: 'Poseidon',
    description: 'A Boon of Poseidon is likely. You can Rarify his blessings once this night.',
    category: KeepsakeCategory.Olympian,
    rank1Effect: 'Rarify Common blessings',
    rank2Effect: 'Rarify Rare blessings',
    rank3Effect: 'Rarify Epic blessings',
    heroicEffect: 'Rarify Heroic blessings',
    bondMessage: 'The lord of land and sea moves mountains and makes waves for his kin.'
  },
  {
    keepsakeId: 23,
    name: 'Barley Sheaf',
    iconUrl: '/images/keepsakes/Barley_Sheaf.webp',
    fromCharacter: 'Demeter',
    description: 'A Boon of Demeter is likely. You can Rarify her blessings once this night.',
    category: KeepsakeCategory.Olympian,
    rank1Effect: 'Rarify Common blessings',
    rank2Effect: 'Rarify Rare blessings',
    rank3Effect: 'Rarify Epic blessings',
    heroicEffect: 'Rarify Heroic blessings',
    bondMessage: 'Even from the very harshest cold eventually springs renewal and warmth.'
  },
  {
    keepsakeId: 24,
    name: 'Harmonic Photon',
    iconUrl: '/images/keepsakes/Harmonic_Photon.webp',
    fromCharacter: 'Apollo',
    description: 'A Boon of Apollo is likely. You can Rarify his blessings once this night.',
    category: KeepsakeCategory.Olympian,
    rank1Effect: 'Rarify Common blessings',
    rank2Effect: 'Rarify Rare blessings',
    rank3Effect: 'Rarify Epic blessings',
    heroicEffect: 'Rarify Heroic blessings',
    bondMessage: 'So many merely aspire to his effortless talent and natural brilliance.'
  },
  {
    keepsakeId: 25,
    name: 'Beautiful Mirror',
    iconUrl: '/images/keepsakes/Beautiful_Mirror.webp',
    fromCharacter: 'Aphrodite',
    description: 'A Boon of Aphrodite is likely. You can Rarify her blessings once this night.',
    category: KeepsakeCategory.Olympian,
    rank1Effect: 'Rarify Common blessings',
    rank2Effect: 'Rarify Rare blessings',
    rank3Effect: 'Rarify Epic blessings',
    heroicEffect: 'Rarify Heroic blessings',
    bondMessage: 'There are such types of love and beauty as shall never fade with time.'
  },
  {
    keepsakeId: 26,
    name: 'Adamant Shard',
    iconUrl: '/images/keepsakes/Adamant_Shard.webp',
    fromCharacter: 'Hephaestus',
    description: 'A Boon of Hephaestus is likely. You can Rarify his blessings once this night.',
    category: KeepsakeCategory.Olympian,
    rank1Effect: 'Rarify Common blessings',
    rank2Effect: 'Rarify Rare blessings',
    rank3Effect: 'Rarify Epic blessings',
    heroicEffect: 'Rarify Heroic blessings',
    bondMessage: 'Who could possibly know more of how to forge the strongest bonds than he?'
  },
  {
    keepsakeId: 27,
    name: 'Everlasting Ember',
    iconUrl: '/images/keepsakes/Everlasting_Ember.webp',
    fromCharacter: 'Hestia',
    description: 'A Boon of Hestia is likely. You can Rarify her blessings once this night.',
    category: KeepsakeCategory.Olympian,
    rank1Effect: 'Rarify Common blessings',
    rank2Effect: 'Rarify Rare blessings',
    rank3Effect: 'Rarify Epic blessings',
    heroicEffect: 'Rarify Heroic blessings',
    bondMessage: 'The warmth of the hearth, the warmth of the heart; always a need for both.'
  },
  {
    keepsakeId: 28,
    name: 'Sword Hilt',
    iconUrl: '/images/keepsakes/Sword_Hilt.webp',
    fromCharacter: 'Ares',
    description: 'A Boon of Ares is likely. You can Rarify his blessings once this night.',
    category: KeepsakeCategory.Olympian,
    rank1Effect: 'Rarify Common blessings',
    rank2Effect: 'Rarify Rare blessings',
    rank3Effect: 'Rarify Epic blessings',
    heroicEffect: 'Rarify Heroic blessings',
    bondMessage: 'Some of the strongest bonds of all are forged between the veterans of war.'
  },

  // Special Keepsakes
  {
    keepsakeId: 10,
    name: 'Metallic Droplet',
    iconUrl: '/images/keepsakes/Metallic_Droplet.webp',
    fromCharacter: 'Hermes',
    description: 'You move, strike, and Channel faster for a limited time.',
    category: KeepsakeCategory.Special,
    rank1Effect: '20% faster for 200 Sec',
    rank2Effect: '20% faster for 250 Sec',
    rank3Effect: '20% faster for 300 Sec',
    heroicEffect: '20% faster for 400 Sec',
    bondMessage: 'Messenger, informant, connection, as trustworthy and dependable as they come.',
    notes: 'Timer continues outside combat and during transitions.'
  },
  {
    keepsakeId: 11,
    name: 'White Antler',
    iconUrl: '/images/keepsakes/White_Antler.webp',
    fromCharacter: 'Artemis',
    description: 'For the next Region, gain bonus Critical chance but limited to 30 Health.',
    category: KeepsakeCategory.Special,
    rank1Effect: '+20% Critical chance',
    rank2Effect: '+25% Critical chance',
    rank3Effect: '+30% Critical chance',
    heroicEffect: '+50% Critical chance',
    bondMessage: 'Together they shine like the Moon, the bright side and the dark combined as one.',
    notes: 'Max Health fixed at 30 for entire region.'
  },
  {
    keepsakeId: 12,
    name: 'Moon Beam',
    iconUrl: '/images/keepsakes/Moon_Beam.webp',
    fromCharacter: 'Selene',
    description: 'A reward from Selene is likely. The next Path of Stars grants bonus upgrades.',
    category: KeepsakeCategory.Special,
    rank1Effect: '+3 upgrades',
    rank2Effect: '+4 upgrades',
    rank3Effect: '+5 upgrades',
    heroicEffect: '+7 upgrades',
    bondMessage: 'Her light she shares with all the world, yet so few know her many mysteries.'
  },
  {
    keepsakeId: 13,
    name: 'Aromatic Phial',
    iconUrl: '/images/keepsakes/Aromatic_Phial.webp',
    fromCharacter: 'Hermes',
    description: 'Gain bonus move speed this night.',
    category: KeepsakeCategory.Special,
    rank1Effect: '+10% Move Speed',
    rank2Effect: '+15% Move Speed',
    rank3Effect: '+20% Move Speed',
    heroicEffect: '+30% Move Speed',
    bondMessage: 'Speed is not merely a gift, but a way of life.'
  },
  {
    keepsakeId: 14,
    name: 'Experimental Hammer',
    iconUrl: '/images/keepsakes/Experimental_Hammer.webp',
    fromCharacter: 'Daedalus',
    description: 'The next Daedalus Hammer offers additional upgrades.',
    category: KeepsakeCategory.Special,
    rank1Effect: '+1 upgrade choice',
    rank2Effect: '+2 upgrade choices',
    rank3Effect: '+3 upgrade choices',
    heroicEffect: '+4 upgrade choices',
    bondMessage: 'Innovation requires experimentation, and experimentation requires trust.'
  },
  {
    keepsakeId: 15,
    name: 'Lion Fang',
    iconUrl: '/images/keepsakes/Lion_Fang.webp',
    fromCharacter: 'Heracles',
    description: 'Deal bonus damage, but take increased damage.',
    category: KeepsakeCategory.Ally,
    rank1Effect: '+15% damage dealt, +10% damage taken',
    rank2Effect: '+20% damage dealt, +10% damage taken',
    rank3Effect: '+25% damage dealt, +10% damage taken',
    heroicEffect: '+35% damage dealt, +10% damage taken',
    bondMessage: 'True strength comes from facing overwhelming odds head-on.'
  },
  {
    keepsakeId: 16,
    name: 'Silken Sash',
    iconUrl: '/images/keepsakes/Silken_Sash.webp',
    fromCharacter: 'Arachne',
    description: 'Your Dash has reduced cooldown.',
    category: KeepsakeCategory.Ally,
    rank1Effect: '-20% Dash cooldown',
    rank2Effect: '-25% Dash cooldown',
    rank3Effect: '-30% Dash cooldown',
    heroicEffect: '-40% Dash cooldown',
    bondMessage: 'Weave through danger with grace and precision.'
  },
  {
    keepsakeId: 17,
    name: 'Crystal Figurine',
    iconUrl: '/images/keepsakes/Crystal_Figurine.webp',
    fromCharacter: 'Unknown',
    description: 'Your Boons have a chance to be of higher rarity.',
    category: KeepsakeCategory.Special,
    rank1Effect: '10% chance of higher rarity',
    rank2Effect: '15% chance of higher rarity',
    rank3Effect: '20% chance of higher rarity',
    heroicEffect: '30% chance of higher rarity',
    bondMessage: 'Clarity reveals what was always there.'
  },
  {
    keepsakeId: 18,
    name: 'Concave Stone',
    iconUrl: '/images/keepsakes/Concave_Stone.webp',
    fromCharacter: 'Unknown',
    description: 'Gain bonus gold from encounters.',
    category: KeepsakeCategory.Special,
    rank1Effect: '+20% Gold',
    rank2Effect: '+30% Gold',
    rank3Effect: '+40% Gold',
    heroicEffect: '+60% Gold',
    bondMessage: 'Wealth flows to those who seek it wisely.'
  },
  {
    keepsakeId: 19,
    name: 'Transcendent Embryo',
    iconUrl: '/images/keepsakes/Transcendent_Embryo.webp',
    fromCharacter: 'Chaos',
    description: 'A reward from Chaos is likely. Chaos blessings have enhanced effects.',
    category: KeepsakeCategory.Special,
    rank1Effect: 'Chaos Boons +1 Level',
    rank2Effect: 'Chaos Boons +2 Levels',
    rank3Effect: 'Chaos Boons +3 Levels',
    heroicEffect: 'Chaos Boons +4 Levels',
    bondMessage: 'From primordial chaos, all creation springs forth.'
  },

  // Additional NPCs/Allies
  {
    keepsakeId: 30,
    name: 'Gorgon Amulet',
    iconUrl: '/images/keepsakes/Gorgon_Amulet.webp',
    fromCharacter: 'Athena',
    description: 'While you have no Death Defiance, Athena may appear with high-quality Boons.',
    category: KeepsakeCategory.NPC,
    rank1Effect: 'At least Common Boons',
    rank2Effect: 'At least Rare Boons',
    rank3Effect: 'At least Epic Boons',
    heroicEffect: 'At least Heroic Boons',
    bondMessage: 'Wisdom brings a kind of distant solitude; but those who have it can grow close.'
  },
  {
    keepsakeId: 31,
    name: 'Fig Leaf',
    iconUrl: '/images/keepsakes/Fig_Leaf.webp',
    fromCharacter: 'Dionysus',
    description: 'A single Encounter in certain Regions may be blissfully free from foes.',
    category: KeepsakeCategory.NPC,
    rank1Effect: '1 Region',
    rank2Effect: '2 Regions',
    rank3Effect: '3 Regions',
    heroicEffect: '4 Regions',
    bondMessage: 'An excess of merriment is only a temporary substitute for true connection.',
    notes: '37% chance per skippable room.'
  },
  {
    keepsakeId: 40,
    name: 'Jeweled Pom',
    iconUrl: '/images/keepsakes/Jeweled_Pom.webp',
    fromCharacter: 'Hades & Persephone',
    description: 'While at Fates\' Whim, gain a random Hades blessing and most Boons have bonus Level.',
    category: KeepsakeCategory.Special,
    rank1Effect: 'Boons +1 Lv',
    rank2Effect: 'Boons +2 Lv',
    rank3Effect: 'Boons +3 Lv',
    heroicEffect: 'Boons +4 Lv',
    bondMessage: 'Even deep within the realm of the dead, there is a life to be had.'
  },
  {
    keepsakeId: 41,
    name: 'Calling Card',
    iconUrl: '/images/keepsakes/Calling_Card.webp',
    fromCharacter: 'Zagreus',
    description: 'While at Fates\' Whim, you can rarify Olympian blessings multiple times.',
    category: KeepsakeCategory.Special,
    rank1Effect: '2 times',
    rank2Effect: '4 times',
    rank3Effect: '6 times',
    heroicEffect: '8 times',
    bondMessage: 'Only those so closely bound by blood can be so different and so much alike.'
  },
  {
    keepsakeId: 42,
    name: 'Time Piece',
    iconUrl: '/images/keepsakes/Time_Piece.webp',
    fromCharacter: 'Chronos',
    description: 'While at Fates\' Whim, you can purge most rewards for Gold.',
    category: KeepsakeCategory.Special,
    rank1Effect: '2 times',
    rank2Effect: '3 times',
    rank3Effect: '4 times',
    heroicEffect: '5 times',
    bondMessage: 'Time is the most precious resource that we have, and have to share.'
  }
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get keepsakes by category
 */
export function getKeepsakesByCategory(category: KeepsakeCategory): Keepsake[] {
  return mockKeepsakes.filter(k => k.category === category);
}

/**
 * Get keepsake by ID
 */
export function getKeepsakeById(id: number): Keepsake | undefined {
  return mockKeepsakes.find(k => k.keepsakeId === id);
}

/**
 * Get all keepsake categories
 */
export function getAllKeepsakeCategories(): KeepsakeCategory[] {
  return Object.values(KeepsakeCategory);
}
