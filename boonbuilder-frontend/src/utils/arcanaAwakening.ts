/**
 * Arcana Card Awakening System
 *
 * Handles automatic activation/deactivation of 0-cost Arcana Cards based on their awakening requirements.
 *
 * Zero-cost cards (automatically controlled):
 * - Card V (The Moon): Activate any surrounding card
 * - Card XIII (The Centaur): Activate Cards that use 1-5 Grasp
 * - Card XX (The Queen): Activate no more than 2 Cards that use the same amount of Grasp
 * - Card XXI (The Fates): Activate all surrounding Cards
 * - Card XXIV (Divinity): Activate all 5 Cards in any other row or column
 * - Card XXV (Judgement): Activate no more than 3 cards total
 */

import { ArcanaCard } from '../data/mockArcanaCards';

export interface ArcanaCardSelection {
  card: ArcanaCard;
  rank: number; // 1-4
}

/**
 * Get surrounding card positions in the 5x5 grid (8 adjacent positions)
 */
const getSurroundingPositions = (row: number, col: number): Array<{ row: number; col: number }> => {
  const positions: Array<{ row: number; col: number }> = [];

  for (let r = row - 1; r <= row + 1; r++) {
    for (let c = col - 1; c <= col + 1; c++) {
      // Skip the center position and out-of-bounds positions
      if ((r !== row || c !== col) && r >= 0 && r < 5 && c >= 0 && c < 5) {
        positions.push({ row: r, col: c });
      }
    }
  }

  return positions;
};

/**
 * Check if any surrounding card is activated
 * Card V (The Moon): "Activate any surrounding card"
 */
const checkMoonAwakening = (card: ArcanaCard, selections: ArcanaCardSelection[]): boolean => {
  const surroundingPositions = getSurroundingPositions(card.gridPosition.row, card.gridPosition.col);

  return selections.some(selection =>
    surroundingPositions.some(pos =>
      selection.card.gridPosition.row === pos.row &&
      selection.card.gridPosition.col === pos.col
    )
  );
};

/**
 * Check if cards using 1-5 Grasp are all activated
 * Card XIII (The Centaur): "Activate Cards that use 1Grasp through 5Grasp"
 */
const checkCentaurAwakening = (allCards: ArcanaCard[], selections: ArcanaCardSelection[]): boolean => {
  // Find at least one card of each grasp cost (1-5)
  for (let graspCost = 1; graspCost <= 5; graspCost++) {
    const hasCardWithCost = selections.some(selection => selection.card.graspCost === graspCost);
    if (!hasCardWithCost) {
      return false;
    }
  }
  return true;
};

/**
 * Check if no more than 2 cards use the same amount of Grasp
 * Card XX (The Queen): "Activate no more than 2 Cards that use the same amount of Grasp"
 */
const checkQueenAwakening = (selections: ArcanaCardSelection[]): boolean => {
  // Count cards by grasp cost (excluding 0-cost cards)
  const graspCounts = new Map<number, number>();

  for (const selection of selections) {
    const cost = selection.card.graspCost;
    if (cost > 0) { // Exclude 0-cost awakening cards
      graspCounts.set(cost, (graspCounts.get(cost) || 0) + 1);
    }
  }

  // Check if any grasp cost has more than 2 cards
  for (const count of graspCounts.values()) {
    if (count > 2) {
      return false;
    }
  }

  return selections.length > 0; // Need at least one card selected
};

/**
 * Check if all surrounding cards are activated
 * Card XXI (The Fates): "Activate all surrounding Cards"
 */
const checkFatesAwakening = (card: ArcanaCard, selections: ArcanaCardSelection[]): boolean => {
  const surroundingPositions = getSurroundingPositions(card.gridPosition.row, card.gridPosition.col);

  // All surrounding positions must have an activated card
  return surroundingPositions.every(pos =>
    selections.some(selection =>
      selection.card.gridPosition.row === pos.row &&
      selection.card.gridPosition.col === pos.col
    )
  );
};

/**
 * Check if all 5 cards in any row or column are activated
 * Card XXIV (Divinity): "Activate all 5 Cards in any other row or column"
 */
const checkDivinityAwakening = (card: ArcanaCard, allCards: ArcanaCard[], selections: ArcanaCardSelection[]): boolean => {
  const { row: cardRow, col: cardCol } = card.gridPosition;

  // Check all rows except the card's own row
  for (let row = 0; row < 5; row++) {
    if (row === cardRow) continue;

    let allActivated = true;
    for (let col = 0; col < 5; col++) {
      const hasCard = selections.some(selection =>
        selection.card.gridPosition.row === row &&
        selection.card.gridPosition.col === col
      );
      if (!hasCard) {
        allActivated = false;
        break;
      }
    }
    if (allActivated) return true;
  }

  // Check all columns except the card's own column
  for (let col = 0; col < 5; col++) {
    if (col === cardCol) continue;

    let allActivated = true;
    for (let row = 0; row < 5; row++) {
      const hasCard = selections.some(selection =>
        selection.card.gridPosition.row === row &&
        selection.card.gridPosition.col === col
      );
      if (!hasCard) {
        allActivated = false;
        break;
      }
    }
    if (allActivated) return true;
  }

  return false;
};

/**
 * Check if no more than 3 cards total are activated
 * Card XXV (Judgement): "Activate no more than 3 cards total"
 */
const checkJudgementAwakening = (selections: ArcanaCardSelection[]): boolean => {
  // Count only non-zero-cost cards
  const nonZeroCostCards = selections.filter(s => s.card.graspCost > 0);
  return nonZeroCostCards.length <= 3 && nonZeroCostCards.length > 0;
};

/**
 * Check if a specific 0-cost card should be awakened based on current selections
 */
export const shouldCardBeAwakened = (
  card: ArcanaCard,
  allCards: ArcanaCard[],
  currentSelections: ArcanaCardSelection[]
): boolean => {
  // Only check 0-cost cards
  if (card.graspCost !== 0) {
    return false;
  }

  // Filter out the card itself from selections (to check requirements based on other cards)
  const otherSelections = currentSelections.filter(s => s.card.cardId !== card.cardId);

  switch (card.cardId) {
    case 5: // Card V - The Moon
      return checkMoonAwakening(card, otherSelections);

    case 13: // Card XIII - The Centaur
      return checkCentaurAwakening(allCards, otherSelections);

    case 20: // Card XX - The Queen
      return checkQueenAwakening(otherSelections);

    case 21: // Card XXI - The Fates
      return checkFatesAwakening(card, otherSelections);

    case 24: // Card XXIV - Divinity
      return checkDivinityAwakening(card, allCards, otherSelections);

    case 25: // Card XXV - Judgement
      return checkJudgementAwakening(otherSelections);

    default:
      return false;
  }
};

/**
 * Update selections to include/exclude awakened cards based on current state
 * Returns new selections array with awakened cards auto-added or removed
 */
export const updateAwakenedCards = (
  allCards: ArcanaCard[],
  currentSelections: ArcanaCardSelection[]
): ArcanaCardSelection[] => {
  const zeroCostCards = allCards.filter(card => card.graspCost === 0);
  const newSelections = [...currentSelections];

  // Check each 0-cost card
  for (const zeroCostCard of zeroCostCards) {
    const isCurrentlySelected = currentSelections.some(s => s.card.cardId === zeroCostCard.cardId);
    const shouldBeAwakened = shouldCardBeAwakened(zeroCostCard, allCards, currentSelections);

    if (shouldBeAwakened && !isCurrentlySelected) {
      // Auto-add the awakened card at rank 1
      newSelections.push({ card: zeroCostCard, rank: 1 });
    } else if (!shouldBeAwakened && isCurrentlySelected) {
      // Auto-remove the card if requirements no longer met
      const index = newSelections.findIndex(s => s.card.cardId === zeroCostCard.cardId);
      if (index !== -1) {
        newSelections.splice(index, 1);
      }
    }
  }

  return newSelections;
};

/**
 * Check if a card is a 0-cost awakening card (system-controlled, not user-clickable)
 */
export const isAwakeningCard = (card: ArcanaCard): boolean => {
  return card.graspCost === 0;
};

/**
 * Get the awakening status for a card (for UI display)
 */
export const getAwakeningStatus = (
  card: ArcanaCard,
  allCards: ArcanaCard[],
  currentSelections: ArcanaCardSelection[]
): { isAwakening: boolean; isAwakened: boolean; requirement: string | undefined } => {
  const isAwakening = isAwakeningCard(card);
  const isAwakened = isAwakening && shouldCardBeAwakened(card, allCards, currentSelections);
  const requirement = card.awakeningRequirement;

  return { isAwakening, isAwakened, requirement };
};
