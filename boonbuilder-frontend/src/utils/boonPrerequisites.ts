import { BoonSlot, Boon, AvailableBoon, AvailableBoonsResponse } from '../types';

export interface BoonCheckResult {
  availableDuo: AvailableBoon[];
  availableLegendary: AvailableBoon[];
  lockedDuo: AvailableBoon[];
  lockedLegendary: AvailableBoon[];
}

/**
 * Extract boon IDs from current selections for prerequisite checking
 */
export const extractSelectedBoonIds = (selectedBoons: Map<BoonSlot, Boon>): number[] => {
  const boonIds: number[] = [];

  selectedBoons.forEach(boon => {
    if (boon.boonId) {
      boonIds.push(boon.boonId);
    }
  });

  return boonIds;
};

/**
 * Filter available boons based on their availability status
 */
export const filterAvailableBoons = (
  availableBoonsResponse: AvailableBoonsResponse
): BoonCheckResult => {
  const availableDuo = availableBoonsResponse.duoBoons.filter(boon => boon.isAvailable);
  const lockedDuo = availableBoonsResponse.duoBoons.filter(boon => !boon.isAvailable);

  const availableLegendary = availableBoonsResponse.legendaryBoons.filter(boon => boon.isAvailable);
  const lockedLegendary = availableBoonsResponse.legendaryBoons.filter(boon => !boon.isAvailable);

  return {
    availableDuo,
    availableLegendary,
    lockedDuo,
    lockedLegendary
  };
};

/**
 * Check if a boon is already selected in the current build
 */
export const isBoonAlreadySelected = (
  boonId: number,
  selectedBoons: Map<BoonSlot, Boon>,
  selectedDuoBoons: AvailableBoon[],
  selectedLegendaryBoons: AvailableBoon[]
): boolean => {
  // Check core boons
  for (const boon of selectedBoons.values()) {
    if (boon.boonId === boonId) {
      return true;
    }
  }

  // Check duo boons
  for (const duoBoon of selectedDuoBoons) {
    if (duoBoon.boonId === boonId) {
      return true;
    }
  }

  // Check legendary boons
  for (const legendaryBoon of selectedLegendaryBoons) {
    if (legendaryBoon.boonId === boonId) {
      return true;
    }
  }

  return false;
};

/**
 * Get missing prerequisites for a locked boon (for UI tooltips)
 */
export const getMissingPrerequisites = (
  lockedBoon: AvailableBoon,
  selectedBoonIds: number[]
): string[] => {
  // This is a simplified version - in a real implementation,
  // you would fetch the full prerequisite details from the API
  const missingReqs: string[] = [];

  if (lockedBoon.type === 'Duo') {
    // For duo boons, check if we have boons from both required gods
    if (lockedBoon.firstGod && lockedBoon.secondGod) {
      missingReqs.push(`Need boons from ${lockedBoon.firstGod.name} and ${lockedBoon.secondGod.name}`);
    }
  } else if (lockedBoon.type === 'Legendary') {
    // For legendary boons, check if we have enough boons from the required god
    if (lockedBoon.god) {
      missingReqs.push(`Need multiple boons from ${lockedBoon.god.name}`);
    }
  }

  return missingReqs;
};

/**
 * Calculate build completion percentage
 */
export const calculateBuildCompletion = (
  selectedBoons: Map<BoonSlot, Boon>,
  selectedDuoBoons: AvailableBoon[],
  selectedLegendaryBoons: AvailableBoon[]
): number => {
  const totalSlots = 5; // Attack, Special, Cast, Sprint, Magick
  const maxSpecialBoons = 3; // Reasonable limit for duo + legendary

  const coreBoonsCount = selectedBoons.size;
  const specialBoonsCount = selectedDuoBoons.length + selectedLegendaryBoons.length;

  const coreCompletion = (coreBoonsCount / totalSlots) * 0.7; // 70% weight for core boons
  const specialCompletion = Math.min(specialBoonsCount / maxSpecialBoons, 1) * 0.3; // 30% weight for special boons

  return Math.round((coreCompletion + specialCompletion) * 100);
};

/**
 * Validate build for conflicts or issues
 */
export const validateBuild = (
  selectedBoons: Map<BoonSlot, Boon>,
  selectedDuoBoons: AvailableBoon[],
  selectedLegendaryBoons: AvailableBoon[]
): { isValid: boolean; warnings: string[] } => {
  const warnings: string[] = [];

  // Check for duplicate boon effects
  const boonNames = new Set<string>();
  selectedBoons.forEach(boon => {
    if (boonNames.has(boon.name)) {
      warnings.push(`Duplicate boon: ${boon.name}`);
    }
    boonNames.add(boon.name);
  });

  // Check for conflicting boon types
  const elementTypes = new Set<string>();
  selectedBoons.forEach(boon => {
    if (boon.element) {
      elementTypes.add(boon.element.toString());
    }
  });

  if (elementTypes.size > 3) {
    warnings.push('Too many different element types - consider focusing on synergies');
  }

  // Check if legendary boons have their prerequisites
  for (const legendaryBoon of selectedLegendaryBoons) {
    if (!legendaryBoon.isAvailable) {
      warnings.push(`${legendaryBoon.name} prerequisites not met`);
    }
  }

  return {
    isValid: warnings.length === 0,
    warnings
  };
};