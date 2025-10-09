/**
 * Mock Arcana Cards Data
 *
 * Arcana Cards are passive bonuses selected before a run.
 * - 25 total cards (I-XXV) arranged in a 5x5 grid
 * - Grasp System: Each card costs 0-5 Grasp, total limit 10-30
 * - 0-cost cards require awakening (special unlock requirements)
 * - Each card has 4 ranks with increasing effects
 * - Cards must be unlocked before use
 */

export interface ArcanaCard {
  cardId: number;              // 1-25
  romanNumeral: string;        // I-XXV
  name: string;                // Card name
  iconUrl: string;             // Path to card image
  description: string;         // What the card does
  graspCost: number;           // 0-5 Grasp cost (0 requires awakening)
  unlockCost: number;          // Unlock cost in resources
  awakeningRequirement?: string; // For 0-cost cards only
  rank1Effect: string;
  rank2Effect: string;
  rank3Effect: string;
  rank4Effect: string;
  quote: string;               // Flavor text
  gridPosition: { row: number; col: number }; // Position in 5x5 grid
}

export const mockArcanaCards: ArcanaCard[] = [
  // Row 1 (Cards I-V)
  {
    cardId: 1,
    romanNumeral: 'I',
    name: 'The Sorceress',
    iconUrl: '/images/Arcana_Cards/Card01.webp',
    description: 'Your Ω Moves are faster.',
    graspCost: 1,
    unlockCost: 1,
    rank1Effect: 'Your Ω Moves are 20% faster',
    rank2Effect: 'Your Ω Moves are 25% faster',
    rank3Effect: 'Your Ω Moves are 30% faster',
    rank4Effect: 'Your Ω Moves are 35% faster',
    quote: 'Left to her own devices, she learned to confront the world on her own terms.',
    gridPosition: { row: 0, col: 0 }
  },
  {
    cardId: 2,
    romanNumeral: 'II',
    name: 'The Wayward Son',
    iconUrl: '/images/Arcana_Cards/Card02.webp',
    description: 'After you exit a Location, restore Health.',
    graspCost: 1,
    unlockCost: 3,
    rank1Effect: 'After you exit a Location, restore 3Health',
    rank2Effect: 'After you exit a Location, restore 4Health',
    rank3Effect: 'After you exit a Location, restore 5Health',
    rank4Effect: 'After you exit a Location, restore 6Health',
    quote: 'Even the Underworld itself struggled to contain him, such was his lust for life.',
    gridPosition: { row: 0, col: 1 }
  },
  {
    cardId: 3,
    romanNumeral: 'III',
    name: 'The Huntress',
    iconUrl: '/images/Arcana_Cards/Card03.webp',
    description: 'While you have less than 100% Magick, your Attack and Special deal bonus damage.',
    graspCost: 2,
    unlockCost: 15,
    rank1Effect: 'While you have less than 100%Magick, your Attack and Special deal +30% damage',
    rank2Effect: 'While you have less than 100%Magick, your Attack and Special deal +40% damage',
    rank3Effect: 'While you have less than 100%Magick, your Attack and Special deal +50% damage',
    rank4Effect: 'While you have less than 100%Magick, your Attack and Special deal +60% damage',
    quote: 'Through discipline and instinct comes sustaining skill both in shadow and the light of the moon.',
    gridPosition: { row: 0, col: 2 }
  },
  {
    cardId: 4,
    romanNumeral: 'IV',
    name: 'Eternity',
    iconUrl: '/images/Arcana_Cards/Card04.webp',
    description: 'While you Channel your Ω Moves, everything moves slower.',
    graspCost: 3,
    unlockCost: 30,
    rank1Effect: 'While you Channel your Ω Moves, everything moves slower for 0.8 Sec',
    rank2Effect: 'While you Channel your Ω Moves, everything moves slower for 1.0 Sec',
    rank3Effect: 'While you Channel your Ω Moves, everything moves slower for 1.2 Sec',
    rank4Effect: 'While you Channel your Ω Moves, everything moves slower for 1.5 Sec',
    quote: 'The inevitable cannot be prevented, though perhaps can be forestalled.',
    gridPosition: { row: 0, col: 3 }
  },
  {
    cardId: 5,
    romanNumeral: 'V',
    name: 'The Moon',
    iconUrl: '/images/Arcana_Cards/Card05.webp',
    description: 'Your Hex also charges up automatically.',
    graspCost: 0,
    unlockCost: 0,
    awakeningRequirement: 'Activate any surrounding card',
    rank1Effect: 'Your Hex also charges up automatically as though you used 1Magick every 1 Sec',
    rank2Effect: 'Your Hex also charges up automatically as though you used 2Magick every 1 Sec',
    rank3Effect: 'Your Hex also charges up automatically as though you used 3Magick every 1 Sec',
    rank4Effect: 'Your Hex also charges up automatically as though you used 4Magick every 1 Sec',
    quote: 'Even as she races across the fathomless sky, she bears witness to all.',
    gridPosition: { row: 0, col: 4 }
  },

  // Row 2 (Cards VI-X)
  {
    cardId: 6,
    romanNumeral: 'VI',
    name: 'The Furies',
    iconUrl: '/images/Arcana_Cards/Card06.webp',
    description: 'You deal bonus damage to foes in your Casts.',
    graspCost: 2,
    unlockCost: 3,
    rank1Effect: 'You deal +20% damage to foes in your Casts',
    rank2Effect: 'You deal +25% damage to foes in your Casts',
    rank3Effect: 'You deal +30% damage to foes in your Casts',
    rank4Effect: 'You deal +35% damage to foes in your Casts',
    quote: 'In the deepest reaches of the Underworld, three are as feared as the god of the dead himself.',
    gridPosition: { row: 1, col: 0 }
  },
  {
    cardId: 7,
    romanNumeral: 'VII',
    name: 'Persistence',
    iconUrl: '/images/Arcana_Cards/Card07.webp',
    description: 'You have additional Health and MagickUp.',
    graspCost: 2,
    unlockCost: 10,
    rank1Effect: 'You have +20Health and +20MagickUp',
    rank2Effect: 'You have +30Health and +30MagickUp',
    rank3Effect: 'You have +40Health and +40MagickUp',
    rank4Effect: 'You have +50Health and +50MagickUp',
    quote: 'He stole from the gods the gift of fire, for mortals; thus he suffered, but grew strong.',
    gridPosition: { row: 1, col: 1 }
  },
  {
    cardId: 8,
    romanNumeral: 'VIII',
    name: 'The Messenger',
    iconUrl: '/images/Arcana_Cards/Card08.webp',
    description: 'Your Casts momentarily make you Impervious and move faster.',
    graspCost: 1,
    unlockCost: 20,
    rank1Effect: 'Your Casts momentarily make you Impervious and move 50% faster',
    rank2Effect: 'Your Casts momentarily make you Impervious and move 60% faster',
    rank3Effect: 'Your Casts momentarily make you Impervious and move 70% faster',
    rank4Effect: 'Your Casts momentarily make you Impervious and move 80% faster',
    quote: 'With incomparable swiftness can he travel from the highest peaks to the lowest depths.',
    gridPosition: { row: 1, col: 2 }
  },
  {
    cardId: 9,
    romanNumeral: 'IX',
    name: 'The Unseen',
    iconUrl: '/images/Arcana_Cards/Card09.webp',
    description: 'You restore Magick over time.',
    graspCost: 5,
    unlockCost: 30,
    rank1Effect: 'You restore 6Magick every 1 Sec',
    rank2Effect: 'You restore 8Magick every 1 Sec',
    rank3Effect: 'You restore 10Magick every 1 Sec',
    rank4Effect: 'You restore 12Magick every 1 Sec',
    quote: 'Upon their ancient oath, in shadow, they serve; and to shadow, they return.',
    gridPosition: { row: 1, col: 3 }
  },
  {
    cardId: 10,
    romanNumeral: 'X',
    name: 'Night',
    iconUrl: '/images/Arcana_Cards/Card10.webp',
    description: 'You have increased chance to deal Critical damage in Ω Combos.',
    graspCost: 2,
    unlockCost: 35,
    rank1Effect: 'You have +9% chance to deal Critical damage with each move in an Ω Combo',
    rank2Effect: 'You have +12% chance to deal Critical damage with each move in an Ω Combo',
    rank3Effect: 'You have +15% chance to deal Critical damage with each move in an Ω Combo',
    rank4Effect: 'You have +18% chance to deal Critical damage with each move in an Ω Combo',
    quote: 'She sprang from Chaos, and formed much of the natural world, above the surface and below.',
    gridPosition: { row: 1, col: 4 }
  },

  // Row 3 (Cards XI-XV)
  {
    cardId: 11,
    romanNumeral: 'XI',
    name: 'The Swift Runner',
    iconUrl: '/images/Arcana_Cards/Card11.webp',
    description: 'Your Sprint is faster and lets you pass through dangers.',
    graspCost: 1,
    unlockCost: 15,
    rank1Effect: 'Your Sprint is 5% faster and lets you pass right through most dangers in your way',
    rank2Effect: 'Your Sprint is 7% faster and lets you pass right through most dangers in your way',
    rank3Effect: 'Your Sprint is 10% faster and lets you pass right through most dangers in your way',
    rank4Effect: 'Your Sprint is 13% faster and lets you pass right through most dangers in your way',
    quote: 'Those who attempted to confront the greatest of the Greeks merely met his spear.',
    gridPosition: { row: 2, col: 0 }
  },
  {
    cardId: 12,
    romanNumeral: 'XII',
    name: 'Death',
    iconUrl: '/images/Arcana_Cards/Card12.webp',
    description: 'You have additional Death Defiance.',
    graspCost: 4,
    unlockCost: 25,
    rank1Effect: 'You have +1Death Defiance',
    rank2Effect: 'You have +2Death Defiance',
    rank3Effect: 'You have +3Death Defiance',
    rank4Effect: 'You have +4Death Defiance',
    quote: 'Some mortals would sense his soft approach, others taken by surprise.',
    gridPosition: { row: 2, col: 1 }
  },
  {
    cardId: 13,
    romanNumeral: 'XIII',
    name: 'The Centaur',
    iconUrl: '/images/Arcana_Cards/Card13.webp',
    description: 'You gain Health and MagickUp as you progress.',
    graspCost: 0,
    unlockCost: 0,
    awakeningRequirement: 'Activate Cards that use 1Grasp through 5Grasp',
    rank1Effect: 'You gain +3Health and +3MagickUp whenever you pass through 5 Locations',
    rank2Effect: 'You gain +4Health and +4MagickUp whenever you pass through 5 Locations',
    rank3Effect: 'You gain +5Health and +5MagickUp whenever you pass through 5 Locations',
    rank4Effect: 'You gain +6Health and +6MagickUp whenever you pass through 5 Locations',
    quote: 'Many of the greatest heroes mortalkind has to offer have in common his patient instructions.',
    gridPosition: { row: 2, col: 2 }
  },
  {
    cardId: 14,
    romanNumeral: 'XIV',
    name: 'Origination',
    iconUrl: '/images/Arcana_Cards/Card14.webp',
    description: 'You deal bonus damage to foes with multiple Curses.',
    graspCost: 5,
    unlockCost: 35,
    rank1Effect: 'You deal +25% damage to foes afflicted with at least 2 Curses from different Olympians',
    rank2Effect: 'You deal +38% damage to foes afflicted with at least 2 Curses from different Olympians',
    rank3Effect: 'You deal +50% damage to foes afflicted with at least 2 Curses from different Olympians',
    rank4Effect: 'You deal +63% damage to foes afflicted with at least 2 Curses from different Olympians',
    quote: 'From the infinite void emerged all that exists, and back to that void it all may yet return.',
    gridPosition: { row: 2, col: 3 }
  },
  {
    cardId: 15,
    romanNumeral: 'XV',
    name: 'The Lovers',
    iconUrl: '/images/Arcana_Cards/Card15.webp',
    description: 'You take no damage from the first hits in Guardian Encounters.',
    graspCost: 3,
    unlockCost: 40,
    rank1Effect: 'You take 0 damage the first 1 time(s) you are hit in Guardian Encounter',
    rank2Effect: 'You take 0 damage the first 2 time(s) you are hit in Guardian Encounter',
    rank3Effect: 'You take 0 damage the first 3 time(s) you are hit in Guardian Encounter',
    rank4Effect: 'You take 0 damage the first 4 time(s) you are hit in Guardian Encounter',
    quote: 'Their music brought them together, and not even Death could keep them apart for long.',
    gridPosition: { row: 2, col: 4 }
  },

  // Row 4 (Cards XVI-XX)
  {
    cardId: 16,
    romanNumeral: 'XVI',
    name: 'The Enchantress',
    iconUrl: '/images/Arcana_Cards/Card16.webp',
    description: 'You have Change of Fate, and can alter Location Rewards.',
    graspCost: 3,
    unlockCost: 25,
    rank1Effect: 'You have +1Change of Fate, and can alter Location Rewards',
    rank2Effect: 'You have +2Change of Fate, and can alter Location Rewards',
    rank3Effect: 'You have +3Change of Fate, and can alter Location Rewards',
    rank4Effect: 'You have +4Change of Fate, and can alter Location Rewards',
    quote: 'In mastering metamorphosis, she discovered that only the true nature of a thing cannot be changed.',
    gridPosition: { row: 3, col: 0 }
  },
  {
    cardId: 17,
    romanNumeral: 'XVII',
    name: 'The Boatman',
    iconUrl: '/images/Arcana_Cards/Card17.webp',
    description: 'You have additional Gold.',
    graspCost: 5,
    unlockCost: 30,
    rank1Effect: 'You have +200Gold',
    rank2Effect: 'You have +250Gold',
    rank3Effect: 'You have +300Gold',
    rank4Effect: 'You have +350Gold',
    quote: 'Vast riches lie hidden in the realm of the dead; but only a modest fee is needed to get in.',
    gridPosition: { row: 3, col: 1 }
  },
  {
    cardId: 18,
    romanNumeral: 'XVIII',
    name: 'The Artificer',
    iconUrl: '/images/Arcana_Cards/Card18.webp',
    description: 'You can turn Minor Finds into Major Finds.',
    graspCost: 3,
    unlockCost: 35,
    rank1Effect: 'You have 1 chance(s) this night to turn any Minor Find into a random Major Find',
    rank2Effect: 'You have 2 chance(s) this night to turn any Minor Find into a random Major Find',
    rank3Effect: 'You have 3 chance(s) this night to turn any Minor Find into a random Major Find',
    rank4Effect: 'You have 4 chance(s) this night to turn any Minor Find into a random Major Find',
    quote: 'Few can turn raw materials into works into work of extraordinary genius; none as can he.',
    gridPosition: { row: 3, col: 2 }
  },
  {
    cardId: 19,
    romanNumeral: 'XIX',
    name: 'Excellence',
    iconUrl: '/images/Arcana_Cards/Card19.webp',
    description: 'Boons have increased chance to be Legendary or Rare.',
    graspCost: 5,
    unlockCost: 40,
    rank1Effect: 'Any Boons you find have +30% chance to include Legendary or at least Rare blessings',
    rank2Effect: 'Any Boons you find have +40% chance to include Legendary or at least Rare blessings',
    rank3Effect: 'Any Boons you find have +50% chance to include Legendary or at least Rare blessings',
    rank4Effect: 'Any Boons you find have +60% chance to include Legendary or at least Rare blessings',
    quote: 'Not even gods can live to their fullest purpose; yet mortals all must strive.',
    gridPosition: { row: 3, col: 3 }
  },
  {
    cardId: 20,
    romanNumeral: 'XX',
    name: 'The Queen',
    iconUrl: '/images/Arcana_Cards/Card20.webp',
    description: 'Boons have increased chance to be Duo.',
    graspCost: 0,
    unlockCost: 0,
    awakeningRequirement: 'Activate no more than 2 Cards that use the same amount of Grasp',
    rank1Effect: 'Any Boons you find have +6% chance to include Duo blessings',
    rank2Effect: 'Any Boons you find have +8% chance to include Duo blessings',
    rank3Effect: 'Any Boons you find have +10% chance to include Duo blessings',
    rank4Effect: 'Any Boons you find have +12% chance to include Duo blessings',
    quote: 'From Olympus she descends to reign in Underworld as the surface-land grows cold.',
    gridPosition: { row: 3, col: 4 }
  },

  // Row 5 (Cards XXI-XXV)
  {
    cardId: 21,
    romanNumeral: 'XXI',
    name: 'The Fates',
    iconUrl: '/images/Arcana_Cards/Card21.webp',
    description: 'You have additional Change of Fate.',
    graspCost: 0,
    unlockCost: 0,
    awakeningRequirement: 'Activate all surrounding Cards',
    rank1Effect: 'You have +2Change of Fate',
    rank2Effect: 'You have +3Change of Fate',
    rank3Effect: 'You have +4Change of Fate',
    rank4Effect: 'You have +5Change of Fate',
    quote: 'Even the gods themselves are subject to the whims of the three weavers of destiny.',
    gridPosition: { row: 4, col: 0 }
  },
  {
    cardId: 22,
    romanNumeral: 'XXII',
    name: 'The Champions',
    iconUrl: '/images/Arcana_Cards/Card22.webp',
    description: 'You have Change of Fate for Boons and other choices.',
    graspCost: 4,
    unlockCost: 35,
    rank1Effect: 'You have +1Change of Fate, and can alter Boons and certain other choices',
    rank2Effect: 'You have +2Change of Fate, and can alter Boons and certain other choices',
    rank3Effect: 'You have +3Change of Fate, and can alter Boons and certain other choices',
    rank4Effect: 'You have +4Change of Fate, and can alter Boons and certain other choices',
    quote: 'Once-mortal foes, they found each other once again in death, and were exalted in Elysium.',
    gridPosition: { row: 4, col: 1 }
  },
  {
    cardId: 23,
    romanNumeral: 'XXIII',
    name: 'Strength',
    iconUrl: '/images/Arcana_Cards/Card23.webp',
    description: 'While you have no Death Defiance, you take less damage.',
    graspCost: 4,
    unlockCost: 40,
    rank1Effect: 'While you have no Death Defiance, you take -30% damage and deal +20%',
    rank2Effect: 'While you have no Death Defiance, you take -35% damage and deal +20%',
    rank3Effect: 'While you have no Death Defiance, you take -40% damage and deal +20%',
    rank4Effect: 'While you have no Death Defiance, you take -45% damage and deal +20%',
    quote: 'The power to surpass the might of the gods is one that must always be held in check.',
    gridPosition: { row: 4, col: 2 }
  },
  {
    cardId: 24,
    romanNumeral: 'XXIV',
    name: 'Divinity',
    iconUrl: '/images/Arcana_Cards/Card24.webp',
    description: 'Boons have increased chance to be Epic.',
    graspCost: 0,
    unlockCost: 0,
    awakeningRequirement: 'Activate all 5 Cards in any other row or column',
    rank1Effect: 'Any Boons you find have +10% chance to include Epic blessings',
    rank2Effect: 'Any Boons you find have +15% chance to include Epic blessings',
    rank3Effect: 'Any Boons you find have +20% chance to include Epic blessings',
    rank4Effect: 'Any Boons you find have +25% chance to include Epic blessings',
    quote: 'The privilege of godhood is bestowed at birth, save for the rarest cases, when it is earned.',
    gridPosition: { row: 4, col: 3 }
  },
  {
    cardId: 25,
    romanNumeral: 'XXV',
    name: 'Judgement',
    iconUrl: '/images/Arcana_Cards/Card25.webp',
    description: 'You activate random Arcana Cards when you vanquish Guardians.',
    graspCost: 0,
    unlockCost: 0,
    awakeningRequirement: 'Activate no more than 3 cards total',
    rank1Effect: 'You activate 3 random inactive Arcana Cards whenever you vanquish a Guardian',
    rank2Effect: 'You activate 4 random inactive Arcana Cards whenever you vanquish a Guardian',
    rank3Effect: 'You activate 5 random inactive Arcana Cards whenever you vanquish a Guardian',
    rank4Effect: 'You activate 6 random inactive Arcana Cards whenever you vanquish a Guardian',
    quote: 'The Underworld King is to decide what shall become of each and every mortal life.',
    gridPosition: { row: 4, col: 4 }
  }
];

/**
 * Helper Functions
 */

/**
 * Get all cards by Grasp cost
 */
export function getCardsByGraspCost(cost: number): ArcanaCard[] {
  return mockArcanaCards.filter(card => card.graspCost === cost);
}

/**
 * Get all 0-cost awakening cards
 */
export function getAwakeningCards(): ArcanaCard[] {
  return mockArcanaCards.filter(card => card.graspCost === 0 && card.awakeningRequirement);
}

/**
 * Calculate total Grasp cost of selected cards
 */
export function calculateTotalGrasp(selectedCards: ArcanaCard[]): number {
  return selectedCards.reduce((total, card) => total + card.graspCost, 0);
}

/**
 * Check if a card can be added given current Grasp usage
 */
export function canAddCard(
  card: ArcanaCard,
  currentCards: ArcanaCard[],
  maxGrasp: number
): boolean {
  const currentGrasp = calculateTotalGrasp(currentCards);
  return currentGrasp + card.graspCost <= maxGrasp;
}

/**
 * Get cards by grid row
 */
export function getCardsByRow(row: number): ArcanaCard[] {
  return mockArcanaCards.filter(card => card.gridPosition.row === row);
}

/**
 * Get card by grid position
 */
export function getCardByPosition(row: number, col: number): ArcanaCard | undefined {
  return mockArcanaCards.find(
    card => card.gridPosition.row === row && card.gridPosition.col === col
  );
}

/**
 * Get effect for card at specific rank
 */
export function getCardEffect(card: ArcanaCard, rank: number): string {
  switch (rank) {
    case 1: return card.rank1Effect;
    case 2: return card.rank2Effect;
    case 3: return card.rank3Effect;
    case 4: return card.rank4Effect;
    default: return card.rank1Effect;
  }
}

/**
 * Default Grasp limits
 */
export const DEFAULT_MAX_GRASP = 30;
export const MAXIMUM_MAX_GRASP = 30;
