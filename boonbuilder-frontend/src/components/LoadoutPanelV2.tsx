/**
 * LoadoutPanelV2 - Game-Authentic Loadout Display
 *
 * Matches Hades II in-game UI with:
 * - Element counter bar at top
 * - Large rounded-square slots with thick glowing borders
 * - Prominent empty state templates
 * - Darker atmospheric styling
 * - Seamless right column for special boons
 */

import React from 'react';
import {
  Boon,
  BoonSlot,
  Weapon,
  WeaponAspect,
  Familiar,
  FamiliarAbility,
  AvailableBoon,
  ElementType
} from '../types';
import { Keepsake } from '../data/mockKeepsakes';
import { ArcanaCard } from '../data/mockArcanaCards';

// ============================================================================
// INTERFACES
// ============================================================================

/**
 * Keepsake selection with rank
 */
interface KeepsakeSelection {
  keepsake: Keepsake;
  rank: number; // 1-4 (4 = Heroic)
}

/**
 * Arcana Card selection with rank
 */
interface ArcanaCardSelection {
  card: ArcanaCard;
  rank: number; // 1-4
}

interface LoadoutPanelV2Props {
  // Build state
  weapon?: Weapon;
  aspect?: WeaponAspect;
  familiar?: Familiar;
  familiarAbility?: FamiliarAbility;
  coreBoons: Map<BoonSlot, Boon>;
  nonCoreBoons: Boon[];
  duoBoons: AvailableBoon[];
  legendaryBoons: AvailableBoon[];
  keepsake: KeepsakeSelection | null;
  arcanaCards: ArcanaCardSelection[];
  maxGrasp: number;

  // Available special boons (eligible but not selected)
  availableDuoBoons: AvailableBoon[];
  availableLegendaryBoons: AvailableBoon[];

  // Handlers
  onRemoveWeapon: () => void;
  onRemoveFamiliar: () => void;
  onRemoveCoreBoon: (slot: BoonSlot) => void;
  onRemoveNonCoreBoon: (boonId: number) => void;
  onRemoveDuoBoon: (boonId: number) => void;
  onRemoveLegendaryBoon: (boonId: number) => void;
  onSelectDuoBoon: (boon: AvailableBoon) => void;
  onSelectLegendaryBoon: (boon: AvailableBoon) => void;
  onPinBoon: (boon: Boon | AvailableBoon) => void;
  onOpenKeepsakeModal: () => void;
  onOpenArcanaModal: () => void;

  // Hover/Pin state
  hoveredBoon: Boon | AvailableBoon | null;
  pinnedBoon: Boon | AvailableBoon | null;
  setHoveredBoon: (boon: Boon | AvailableBoon | null) => void;
}

// Slot display names (game-accurate)
const slotDisplayNames: Record<BoonSlot, string> = {
  [BoonSlot.Attack]: "Strike",
  [BoonSlot.Special]: "Flourish",
  [BoonSlot.Cast]: "Ring",
  [BoonSlot.Sprint]: "Rush",
  [BoonSlot.Magick]: "Gain"
};

// Element icons and labels
const elementConfig: Record<ElementType, { iconUrl: string; label: string; color: string }> = {
  [ElementType.Earth]: { iconUrl: '/images/elements/Element_Earth_logo.webp', label: 'Earth', color: 'amber' },
  [ElementType.Water]: { iconUrl: '/images/elements/Element_Water_logo.webp', label: 'Water', color: 'blue' },
  [ElementType.Air]: { iconUrl: '/images/elements/Element_Air_logo.webp', label: 'Air', color: 'cyan' },
  [ElementType.Fire]: { iconUrl: '/images/elements/Element_Fire_logo.webp', label: 'Fire', color: 'orange' },
  [ElementType.Aether]: { iconUrl: '/images/elements/Element_Aether_logo.webp', label: 'Aether', color: 'purple' }
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Calculate element counts from selected boons
 */
function calculateElementCounts(coreBoons: Map<BoonSlot, Boon>): Map<ElementType, number> {
  const counts = new Map<ElementType, number>([
    [ElementType.Earth, 0],
    [ElementType.Water, 0],
    [ElementType.Air, 0],
    [ElementType.Fire, 0],
    [ElementType.Aether, 0]
  ]);

  coreBoons.forEach(boon => {
    if (boon.element !== undefined && boon.element !== null) {
      counts.set(boon.element, (counts.get(boon.element) || 0) + 1);
    }
  });

  return counts;
}

/**
 * Check if boon is currently pinned
 */
function isBoonPinned(boon: Boon | AvailableBoon | undefined, pinnedBoon: Boon | AvailableBoon | null): boolean {
  if (!boon || !pinnedBoon) return false;
  return boon.boonId === pinnedBoon.boonId;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const LoadoutPanelV2: React.FC<LoadoutPanelV2Props> = ({
  weapon,
  aspect,
  familiar,
  familiarAbility,
  coreBoons,
  nonCoreBoons,
  duoBoons,
  legendaryBoons,
  keepsake,
  arcanaCards,
  maxGrasp,
  availableDuoBoons,
  availableLegendaryBoons,
  onRemoveWeapon,
  onRemoveFamiliar,
  onRemoveCoreBoon,
  onRemoveNonCoreBoon,
  onRemoveDuoBoon,
  onRemoveLegendaryBoon,
  onSelectDuoBoon,
  onSelectLegendaryBoon,
  onPinBoon,
  onOpenKeepsakeModal,
  onOpenArcanaModal,
  hoveredBoon,
  pinnedBoon,
  setHoveredBoon
}) => {
  // Track dismissed available boons (don't show until user clicks "+x available" again)
  const [dismissedDuoBoons, setDismissedDuoBoons] = React.useState<Set<number>>(new Set());
  const [dismissedLegendaryBoons, setDismissedLegendaryBoons] = React.useState<Set<number>>(new Set());

  const elementCounts = calculateElementCounts(coreBoons);

  // Calculate current Grasp usage
  const currentGrasp = arcanaCards.reduce((sum, s) => sum + s.card.graspCost, 0);
  const isOverGraspLimit = currentGrasp > maxGrasp;

  // Filter available boons to exclude dismissed ones
  const visibleAvailableDuoBoons = availableDuoBoons.filter(b => !dismissedDuoBoons.has(b.boonId));
  const visibleAvailableLegendaryBoons = availableLegendaryBoons.filter(b => !dismissedLegendaryBoons.has(b.boonId));

  // Handlers for dismissing available boons
  const handleDismissDuoBoon = (boonId: number) => {
    setDismissedDuoBoons(prev => new Set(prev).add(boonId));
  };

  const handleDismissLegendaryBoon = (boonId: number) => {
    setDismissedLegendaryBoons(prev => new Set(prev).add(boonId));
  };

  // Handler for showing all available boons again (when clicking "+x available")
  const handleShowAllDuoBoons = () => {
    setDismissedDuoBoons(new Set());
  };

  const handleShowAllLegendaryBoons = () => {
    setDismissedLegendaryBoons(new Set());
  };

  return (
    <div className="bg-gray-950/90 backdrop-blur-sm border-4 border-purple-500/30 rounded-2xl p-5 h-full overflow-auto shadow-2xl shadow-purple-500/10">

      {/* Header */}
      <h2 className="text-2xl font-bold text-purple-200 mb-3 text-center tracking-wide">Loadout</h2>

      {/* Element Counter Bar */}
      <div className="bg-gray-900/80 rounded-xl border-2 border-gray-700/50 p-3 mb-4 shadow-inner">
        <div className="flex items-center justify-around">
          {[ElementType.Earth, ElementType.Water, ElementType.Air, ElementType.Fire, ElementType.Aether].map(element => {
            const config = elementConfig[element];
            const count = elementCounts.get(element) || 0;
            return (
              <div key={element} className="flex items-center gap-2" title={config.label}>
                <img src={config.iconUrl} alt={config.label} className="w-8 h-8 object-contain" />
                <span className={`text-xl font-bold ${count > 0 ? `text-${config.color}-400` : 'text-gray-600'}`}>
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-2 gap-4 h-[calc(100%-8rem)]">

        {/* ===== LEFT COLUMN: Main Loadout (Weapon + Familiar + Core Boons) ===== */}
        <div className="space-y-3 flex flex-col">

          {/* Weapon Slot */}
          <div className="bg-gray-900/70 rounded-xl p-3 border-4 border-purple-500/20 shadow-lg hover:border-purple-500/40 transition-all">
            <div className="text-xs text-gray-400 mb-2 font-semibold">Weapon</div>
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-xl bg-gray-800/60 border-2 border-gray-600/50 flex items-center justify-center shadow-inner">
                {weapon && aspect ? (
                  <img src={aspect.iconUrl} alt={aspect.name} className="w-14 h-14 object-cover rounded-lg" />
                ) : (
                  <img src="/images/slots/weapon.webp" alt="Empty weapon" className="w-12 h-12 object-cover rounded opacity-40 grayscale" />
                )}
              </div>
              <div className="flex-1">
                {weapon && aspect ? (
                  <>
                    <div className="text-sm text-white font-semibold">{weapon.name}</div>
                    <div className="text-xs text-gray-400">{aspect.name}</div>
                  </>
                ) : (
                  <div className="text-sm text-gray-600 italic">No Weapon</div>
                )}
              </div>
              {weapon && (
                <button
                  onClick={onRemoveWeapon}
                  className="text-red-400 hover:text-red-300 text-xl px-2"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Familiar Slot */}
          <div className="bg-gray-900/70 rounded-xl p-3 border-4 border-purple-500/20 shadow-lg hover:border-purple-500/40 transition-all">
            <div className="text-xs text-gray-400 mb-2 font-semibold">Familiar</div>
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-xl bg-gray-800/60 border-2 border-gray-600/50 flex items-center justify-center shadow-inner">
                {familiar ? (
                  <img src={familiar.iconUrl} alt={familiar.name} className="w-14 h-14 object-cover rounded-lg" />
                ) : (
                  <img src="/images/slots/familiar.png" alt="Empty familiar" className="w-12 h-12 object-cover rounded opacity-40 grayscale" />
                )}
              </div>
              <div className="flex-1">
                {familiar ? (
                  <>
                    <div className="text-sm text-white font-semibold">{familiar.name}</div>
                    {familiarAbility && (
                      <div className="text-xs text-gray-400">{familiarAbility.name}</div>
                    )}
                  </>
                ) : (
                  <div className="text-sm text-gray-600 italic">No Familiar</div>
                )}
              </div>
              {familiar && (
                <button
                  onClick={onRemoveFamiliar}
                  className="text-red-400 hover:text-red-300 text-xl px-2"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Core Boons Section */}
          <div className="bg-gray-900/60 rounded-xl p-4 border-2 border-gray-700/40 shadow-inner">
            <div className="text-sm text-gray-300 mb-3 font-semibold">Core Boons</div>
            <div className="space-y-3">
              {[
                { slot: BoonSlot.Attack, label: 'Attack', image: 'attack.png' },
                { slot: BoonSlot.Special, label: 'Special', image: 'special.png' },
                { slot: BoonSlot.Cast, label: 'Cast', image: 'cast.png' },
                { slot: BoonSlot.Sprint, label: 'Sprint', image: 'sprint.png' },
                { slot: BoonSlot.Magick, label: 'Magick', image: 'magicka.png' }
              ].map(({ slot, label, image }) => {
                const boon = coreBoons.get(slot);
                const isPinned = isBoonPinned(boon, pinnedBoon);

                return (
                  <div
                    key={slot}
                    className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all ${
                      isPinned
                        ? 'bg-purple-600/30 border-4 border-purple-500/70 shadow-xl shadow-purple-500/30'
                        : 'bg-gray-800/40 border-2 border-gray-600/30 hover:bg-gray-700/50 hover:border-gray-500/50'
                    }`}
                    onClick={() => boon && onPinBoon(boon)}
                    onMouseEnter={() => boon && setHoveredBoon(boon)}
                    onMouseLeave={() => setHoveredBoon(null)}
                  >
                    <div className="w-14 h-14 rounded-lg bg-gray-800/60 border-2 border-gray-700/50 flex items-center justify-center shadow-inner">
                      {boon ? (
                        <img src={boon.iconUrl} alt={boon.name} className="w-12 h-12 object-cover rounded" />
                      ) : (
                        <img src={`/images/slots/${image}`} alt={`Empty ${label}`} className="w-10 h-10 object-cover rounded opacity-40 grayscale" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] text-gray-400 font-semibold">{slotDisplayNames[slot]}</div>
                      {boon ? (
                        <div className="text-sm text-white truncate">{boon.name}</div>
                      ) : (
                        <div className="text-sm text-gray-600 italic">Empty</div>
                      )}
                    </div>
                    {boon && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveCoreBoon(slot);
                        }}
                        className="text-red-400 hover:text-red-300 text-xl px-1"
                      >
                        ×
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Arcana Cards & Keepsakes Buttons */}
          <div className="flex-1 flex flex-col gap-3">
            {/* Arcana Cards Button */}
            <button
              onClick={onOpenArcanaModal}
              className={`flex-1 w-full bg-gray-900/70 hover:bg-gray-800/70 rounded-xl p-5 border-2 transition-all shadow-lg flex items-center gap-3 ${
                isOverGraspLimit
                  ? 'border-red-500/50 hover:border-red-500/70'
                  : 'border-purple-500/30 hover:border-purple-500/50'
              }`}
              title="Arcana Cards"
            >
              <img src="/images/Arcana_Cards/Arcana_Cards_Logo.webp" alt="Arcana Cards" className="w-16 h-16 object-contain" />
              <div className="flex-1 text-left">
                <div className={`text-xs font-semibold flex items-center gap-1 ${
                  isOverGraspLimit ? 'text-red-400' : 'text-purple-300'
                }`}>
                  <span>Arcana Cards</span>
                  {isOverGraspLimit && <span>⚠</span>}
                </div>
                <div className={`text-[10px] ${
                  isOverGraspLimit ? 'text-red-300' : 'text-gray-400'
                }`}>
                  {arcanaCards.length > 0
                    ? `${arcanaCards.length} active${isOverGraspLimit ? ` (${currentGrasp}/${maxGrasp} Grasp)` : ''}`
                    : 'None active'
                  }
                </div>
              </div>
            </button>

            {/* Keepsakes Button */}
            <button
              onClick={onOpenKeepsakeModal}
              className="flex-1 w-full bg-gray-900/70 hover:bg-gray-800/70 rounded-xl p-5 border-2 border-purple-500/30 hover:border-purple-500/50 transition-all shadow-lg flex items-center gap-3"
              title="Keepsakes"
            >
              <img src="/images/keepsakes/keepsakes_logo.webp" alt="Keepsakes" className="w-16 h-16 object-contain" />
              <div className="flex-1 text-left">
                <div className="text-xs text-purple-300 font-semibold">Keepsakes</div>
                <div className="text-[10px] text-gray-400">
                  {keepsake
                    ? `${keepsake.keepsake.name} (R${keepsake.rank === 4 ? 'H' : keepsake.rank})`
                    : 'None equipped'
                  }
                </div>
              </div>
            </button>
          </div>

        </div>

        {/* ===== RIGHT COLUMN: Seamless Special Boons Area ===== */}
        <div className="bg-gray-900/80 rounded-xl p-4 border-2 border-gray-700/30 shadow-inner backdrop-blur-sm" style={{ display: 'grid', gridTemplateRows: '55% 15% 15% 15%', gap: '12px' }}>

          {/* Non-Core Boons - 55% height, scrollable */}
          <div className="flex flex-col overflow-hidden">
            <div className="text-sm text-gray-300 mb-2 font-semibold flex items-center justify-between flex-shrink-0">
              <span>Non-Core</span>
              <span className="text-xs text-gray-500">({nonCoreBoons.length})</span>
            </div>
            <div className="flex-1 overflow-y-auto pr-1">
              {nonCoreBoons.length > 0 ? (
                <div className="grid grid-cols-4 gap-2">
                  {nonCoreBoons.map(boon => {
                    const isPinned = isBoonPinned(boon, pinnedBoon);
                    return (
                      <div key={boon.boonId} className="relative group">
                        <div
                          className={`w-full aspect-square rounded-lg p-1 flex items-center justify-center cursor-pointer transition-all ${
                            isPinned
                              ? 'bg-purple-600/30 border-4 border-purple-500/70 shadow-xl shadow-purple-500/30'
                              : 'bg-gray-800/50 border-2 border-gray-600/40 hover:bg-gray-700/60 hover:border-gray-500/60'
                          }`}
                          onMouseEnter={() => setHoveredBoon(boon)}
                          onMouseLeave={() => setHoveredBoon(null)}
                          onClick={() => onPinBoon(boon)}
                        >
                          <img src={boon.iconUrl} alt={boon.name} className="w-full h-full object-cover rounded" />
                        </div>
                        <button
                          onClick={() => onRemoveNonCoreBoon(boon.boonId)}
                          className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-lg"
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-xs text-gray-600 italic text-center py-4 bg-gray-900/30 rounded-lg border border-gray-800/50">
                  None selected
                </div>
              )}
            </div>
          </div>

          {/* Duo Boons - 15% height, scrollable */}
          <div className="flex flex-col overflow-hidden">
            <div className="w-full text-center mb-2 flex-shrink-0">
              <div className="text-sm text-yellow-300 font-semibold">
                Duo Boons ({duoBoons.length})
              </div>
              {visibleAvailableDuoBoons.length > 0 && (
                <button
                  onClick={handleShowAllDuoBoons}
                  className="text-xs text-green-400 font-bold px-2 py-0.5 bg-green-900/20 rounded border border-green-500/30 hover:bg-green-900/30 transition-colors mt-1"
                  title="Available boons can be added based on your current build"
                >
                  +{visibleAvailableDuoBoons.length} available
                </button>
              )}
            </div>
            <div className="flex-1 overflow-x-auto overflow-y-hidden pr-1">
              {(duoBoons.length > 0 || visibleAvailableDuoBoons.length > 0) ? (
                <div className="flex gap-2 h-full items-start">
                  {/* Selected Duo Boons */}
                  {duoBoons.map(d => {
                    const isPinned = isBoonPinned(d, pinnedBoon);
                    return (
                      <div key={d.boonId} className="relative group flex-shrink-0">
                        <div
                          className={`w-12 h-12 rounded-lg cursor-pointer transition-all ${
                            isPinned
                              ? 'bg-purple-600/30 border-4 border-purple-500/70 shadow-xl shadow-purple-500/30'
                              : 'bg-yellow-900/30 border-2 border-yellow-500/40 hover:border-yellow-500/70'
                          }`}
                          onMouseEnter={() => setHoveredBoon(d)}
                          onMouseLeave={() => setHoveredBoon(null)}
                          onClick={() => onPinBoon(d)}
                        >
                          <img src={d.iconUrl} alt={d.name} className="w-full h-full object-cover rounded-lg" />
                        </div>
                        <button
                          onClick={() => onRemoveDuoBoon(d.boonId)}
                          className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-lg"
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                  {/* Available Duo Boons (pulsing green glow) */}
                  {visibleAvailableDuoBoons.map(d => {
                    const isPinned = isBoonPinned(d, pinnedBoon);
                    return (
                      <div key={`available-${d.boonId}`} className="relative group flex-shrink-0">
                        <div
                          className={`w-12 h-12 rounded-lg cursor-pointer transition-all animate-pulse ${
                            isPinned
                              ? 'bg-purple-600/30 border-4 border-purple-500/70 shadow-xl shadow-purple-500/30'
                              : 'bg-green-900/30 border-2 border-green-500/60 hover:border-green-400/80 shadow-lg shadow-green-500/50'
                          }`}
                          onMouseEnter={() => setHoveredBoon(d)}
                          onMouseLeave={() => setHoveredBoon(null)}
                          onClick={() => onPinBoon(d)}
                        >
                          <img src={d.iconUrl} alt={d.name} className="w-full h-full object-cover rounded-lg" />
                        </div>
                        {/* Add button (green +) */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectDuoBoon(d);
                          }}
                          className="absolute -top-1 -left-1 w-5 h-5 bg-green-500 rounded-full text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-lg font-bold"
                          title="Add to build"
                        >
                          +
                        </button>
                        {/* Dismiss button (×) */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDismissDuoBoon(d.boonId);
                          }}
                          className="absolute -top-1 -right-1 w-4 h-4 bg-gray-600 rounded-full text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-lg"
                          title="Dismiss"
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-xs text-gray-600 italic text-center py-2 bg-yellow-900/10 rounded-lg border border-yellow-900/30">
                  None selected
                </div>
              )}
            </div>
          </div>

          {/* Legendary Boons - 15% height, scrollable */}
          <div className={`flex flex-col overflow-hidden ${
            eligibleLegendaryCount > 0 ? 'animate-pulse-subtle' : ''
          }`}>
            <div className="flex items-center justify-between mb-2 flex-shrink-0">
              <div className="text-sm text-orange-300 font-semibold flex items-center gap-2">
                <span>Legendary Boons</span>
                <span className="text-xs text-gray-400">({legendaryBoons.length})</span>
              </div>
              {eligibleLegendaryCount > 0 && (
                <div className="text-xs text-green-400 font-bold px-2 py-1 bg-green-900/20 rounded border border-green-500/30">
                  +{eligibleLegendaryCount} available
                </div>
              )}
            </div>
            <div className="flex-1 overflow-x-auto overflow-y-hidden pr-1">
              {legendaryBoons.length > 0 ? (
                <div className="flex gap-2 h-full items-start">
                  {legendaryBoons.map(l => {
                    const isPinned = isBoonPinned(l, pinnedBoon);
                    return (
                      <div key={l.boonId} className="relative group flex-shrink-0">
                        <div
                          className={`w-12 h-12 rounded-lg cursor-pointer transition-all ${
                            isPinned
                              ? 'bg-purple-600/30 border-4 border-purple-500/70 shadow-xl shadow-purple-500/30'
                              : 'bg-orange-900/30 border-2 border-orange-500/40 hover:border-orange-500/70'
                          }`}
                          onMouseEnter={() => setHoveredBoon(l)}
                          onMouseLeave={() => setHoveredBoon(null)}
                          onClick={() => onPinBoon(l)}
                        >
                          <img src={l.iconUrl} alt={l.name} className="w-full h-full object-cover rounded-lg" />
                        </div>
                        <button
                          onClick={() => onRemoveLegendaryBoon(l.boonId)}
                          className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-lg"
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-xs text-gray-600 italic text-center py-2 bg-orange-900/10 rounded-lg border border-orange-900/30">
                  None selected
                </div>
              )}
            </div>
          </div>

          {/* Infusions - 15% height, scrollable */}
          <div className="flex flex-col overflow-hidden">
            <div className="text-sm text-purple-300 font-semibold mb-2 flex items-center gap-2 flex-shrink-0">
              <span>Infusions</span>
              <span className="text-xs text-gray-400">(0)</span>
            </div>
            <div className="flex-1 overflow-y-auto pr-1">
              <div className="text-xs text-gray-600 italic text-center py-2 bg-purple-900/10 rounded-lg border border-purple-900/30">
                None selected
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoadoutPanelV2;
