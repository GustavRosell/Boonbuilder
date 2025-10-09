/**
 * BoonBuilderV2 - Game-Authentic Build Creator
 *
 * This is a parallel implementation alongside the existing Creator page.
 * Uses mock data for UI development without backend dependency.
 *
 * Key Features:
 * - Dual Radial Menu System (Core + Non-Core boon selection)
 * - Game-Authentic Loadout Panel (matches Hades II screenshot)
 * - View Toggle (Radial ↔ List View)
 * - God Categorization (Core, NonStandard, NPC, Allies)
 * - Dedicated Build Controls and Boon Details Panels
 *
 * Route: /boon-builder-v2
 */

import React, { useState, useEffect } from 'react';
import {
  Boon,
  BoonSlot,
  Weapon,
  WeaponAspect,
  Familiar,
  FamiliarAbility,
  AvailableBoon,
  BuildDifficulty,
  BuildTier
} from '../types';
import {
  mockNonCoreBoons,
  GodType,
  getGodsByType
} from '../data/mockBoonData';
import BuildControlsPanel from './BuildControlsPanel';
import BoonDetailsPanel from './BoonDetailsPanel';
import ImageWithFallback from './ImageWithFallback';

// ============================================================================
// TYPES
// ============================================================================

/**
 * Extended BuildState with core/non-core separation
 */
interface BuildStateV2 {
  weapon?: Weapon;
  aspect?: WeaponAspect;
  familiar?: Familiar;
  familiarAbility?: FamiliarAbility;
  coreBoons: Map<BoonSlot, Boon>;      // Slot-based core boons
  nonCoreBoons: Boon[];                 // Array of non-core boons
  duoBoons: AvailableBoon[];
  legendaryBoons: AvailableBoon[];
  name: string;
  description: string;
  isFavorite: boolean;
  difficulty: BuildDifficulty;
  tier: BuildTier;
}

type ViewMode = 'radial' | 'list';

// Slot display name mapping (game-accurate)
const slotDisplayNames: Record<BoonSlot, string> = {
  [BoonSlot.Attack]: "Strike",
  [BoonSlot.Special]: "Flourish",
  [BoonSlot.Cast]: "Ring",
  [BoonSlot.Sprint]: "Rush",
  [BoonSlot.Magick]: "Gain"
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const BoonBuilderV2: React.FC = () => {
  // State management
  const [selectedBuild, setSelectedBuild] = useState<BuildStateV2>({
    coreBoons: new Map(),
    nonCoreBoons: [],
    duoBoons: [],
    legendaryBoons: [],
    name: '',
    description: '',
    isFavorite: false,
    difficulty: BuildDifficulty.Medium,
    tier: BuildTier.B
  });

  const [viewMode, setViewMode] = useState<ViewMode>('radial');
  const [hoveredBoon, setHoveredBoon] = useState<Boon | AvailableBoon | null>(null);
  const [pinnedBoon, setPinnedBoon] = useState<Boon | AvailableBoon | null>(null);

  // Available special boons (for prerequisite checking - will be populated when backend is ready)
  const [availableDuoBoons, setAvailableDuoBoons] = useState<AvailableBoon[]>([]);
  const [availableLegendaryBoons, setAvailableLegendaryBoons] = useState<AvailableBoon[]>([]);

  // TODO: Remove this mock data once backend prerequisite checking is implemented
  // Mock data for testing the AvailableSpecialBoonsIndicator component
  useEffect(() => {
    // Simulate some available duo boons for testing
    const mockDuoBoons: AvailableBoon[] = [
      {
        boonId: 9001,
        name: 'Lightning Rod',
        description: 'Your Cast strikes repeatedly in an area, striking foes around it with lightning.',
        effect: '+50% Cast damage',
        iconUrl: '/images/boons/duo_zeus_poseidon.webp',
        type: 'Duo',
        isAvailable: true
      },
      {
        boonId: 9002,
        name: 'Splitting Bolt',
        description: 'Your lightning bolt effects have a chance to strike twice.',
        effect: '40% chance to double strike',
        iconUrl: '/images/boons/duo_zeus_artemis.webp',
        type: 'Duo',
        isAvailable: true
      }
    ];

    // Simulate some available legendary boons for testing
    const mockLegendaryBoons: AvailableBoon[] = [
      {
        boonId: 9101,
        name: 'Winter Harvest',
        description: 'Chill-affected foes shatter at 10% hp, inflicting Chill nearby.',
        effect: 'Shatter at 10% HP',
        iconUrl: '/images/boons/legendary_demeter.webp',
        type: 'Legendary',
        isAvailable: true
      }
    ];

    setAvailableDuoBoons(mockDuoBoons);
    setAvailableLegendaryBoons(mockLegendaryBoons);
  }, []);

  // ========== HANDLERS ==========

  const handleRemoveCoreBoon = (slot: BoonSlot) => {
    const newCoreBoons = new Map(selectedBuild.coreBoons);
    newCoreBoons.delete(slot);
    setSelectedBuild({ ...selectedBuild, coreBoons: newCoreBoons });
  };

  const handleSelectNonCoreBoon = (boon: Boon) => {
    // Check if already selected
    if (selectedBuild.nonCoreBoons.some(b => b.boonId === boon.boonId)) {
      return;
    }
    const newNonCoreBoons = [...selectedBuild.nonCoreBoons, boon];
    setSelectedBuild({ ...selectedBuild, nonCoreBoons: newNonCoreBoons });
  };

  const handleRemoveNonCoreBoon = (boonId: number) => {
    const newNonCoreBoons = selectedBuild.nonCoreBoons.filter(b => b.boonId !== boonId);
    setSelectedBuild({ ...selectedBuild, nonCoreBoons: newNonCoreBoons });
  };

  const handleSelectDuoBoon = (boon: AvailableBoon) => {
    if (selectedBuild.duoBoons.some(b => b.boonId === boon.boonId)) return;
    setSelectedBuild({ ...selectedBuild, duoBoons: [...selectedBuild.duoBoons, boon] });
  };

  const handleSelectLegendaryBoon = (boon: AvailableBoon) => {
    if (selectedBuild.legendaryBoons.some(b => b.boonId === boon.boonId)) return;
    setSelectedBuild({ ...selectedBuild, legendaryBoons: [...selectedBuild.legendaryBoons, boon] });
  };

  const handleToggleView = () => {
    setViewMode(prev => prev === 'radial' ? 'list' : 'radial');
  };

  const handleSaveBuild = () => {
    console.log('Saving build:', selectedBuild);
    // TODO: Implement actual save logic
    alert('Build save functionality coming soon!');
  };

  const handlePinBoon = (boon: Boon | AvailableBoon) => {
    setPinnedBoon(boon);
  };

  const handleClearPin = () => {
    setPinnedBoon(null);
  };

  // ========== RENDER ==========

  // Calculate eligible special boons (available but not yet selected)
  const eligibleDuoBoons = availableDuoBoons.filter(
    b => b.isAvailable && !selectedBuild.duoBoons.some(s => s.boonId === b.boonId)
  );
  const eligibleLegendaryBoons = availableLegendaryBoons.filter(
    b => b.isAvailable && !selectedBuild.legendaryBoons.some(s => s.boonId === b.boonId)
  );
  const eligibleDuoCount = eligibleDuoBoons.length;
  const eligibleLegendaryCount = eligibleLegendaryBoons.length;

  // Helper to check if a boon is currently pinned
  const isBoonPinned = (boon: Boon | AvailableBoon | undefined) => {
    if (!boon || !pinnedBoon) return false;
    return boon.boonId === pinnedBoon.boonId;
  };

  return (
    <div className="h-full bg-gradient-to-br from-gray-900 via-purple-900/10 to-gray-900 text-white overflow-hidden">
      {/* Main Content Area */}
      <div className="h-full p-3">
        <div className="max-w-full h-full">

          {/* 3-Column Layout: Loadout | Radial/List | Build Controls + Details */}
          <div className="grid grid-cols-[680px_1fr_460px] gap-4 h-full">

            {/* ===== COLUMN 1: LOADOUT PANEL ===== */}
            <div className="bg-gray-900/60 backdrop-blur-sm border border-purple-500/30 rounded-xl p-4 h-full overflow-auto">
              <h2 className="text-xl font-bold text-purple-300 mb-3 text-center">Loadout</h2>

              <div className="grid grid-cols-2 gap-3 h-[calc(100%-3rem)]">
                {/* LEFT COLUMN: Weapon + Familiar + Core Boons */}
                <div className="space-y-3 flex flex-col">

                  {/* Weapon Slot */}
                  <div className="bg-gray-800/40 rounded-lg p-2 border border-gray-700/50">
                    <div className="text-xs text-gray-400 mb-1">Weapon</div>
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-12 rounded bg-gray-700/30 border border-gray-600/50 flex items-center justify-center">
                        <img src="/images/slots/weapon.webp" alt="Empty weapon" className="w-10 h-10 object-cover rounded opacity-30" />
                      </div>
                      <div className="flex-1 text-xs text-gray-500">No Weapon</div>
                    </div>
                  </div>

                  {/* Familiar Slot */}
                  <div className="bg-gray-800/40 rounded-lg p-2 border border-gray-700/50">
                    <div className="text-xs text-gray-400 mb-1">Familiar</div>
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-12 rounded bg-gray-700/30 border border-gray-600/50 flex items-center justify-center">
                        <img src="/images/slots/familiar.png" alt="Empty familiar" className="w-10 h-10 object-cover rounded opacity-30" />
                      </div>
                      <div className="flex-1 text-xs text-gray-500">No Familiar</div>
                    </div>
                  </div>

                  {/* Core Boon Slots - Compact */}
                  <div className="bg-gray-800/20 rounded-lg p-3 flex-1">
                    <div className="text-sm text-gray-400 mb-2">Core Boons</div>
                    <div className="space-y-1.5">
                      {[
                        { slot: BoonSlot.Attack, label: 'Attack', image: 'attack.png' },
                        { slot: BoonSlot.Special, label: 'Special', image: 'special.png' },
                        { slot: BoonSlot.Cast, label: 'Cast', image: 'cast.png' },
                        { slot: BoonSlot.Sprint, label: 'Sprint', image: 'sprint.png' },
                        { slot: BoonSlot.Magick, label: 'Magick', image: 'magick.png' }
                      ].map(({ slot, label, image }) => {
                        const boon = selectedBuild.coreBoons.get(slot);
                        return (
                          <div
                            key={slot}
                            className={`flex items-center gap-1.5 p-1.5 rounded cursor-pointer transition-all ${
                              boon && isBoonPinned(boon)
                                ? 'bg-purple-600/30 border-2 border-purple-500/70 shadow-lg shadow-purple-500/20'
                                : 'bg-gray-700/20 border border-gray-600/30 hover:bg-gray-600/30'
                            }`}
                            onClick={() => boon && handlePinBoon(boon)}
                          >
                            <div className="w-10 h-10 rounded bg-gray-700/50 border border-gray-600/50 flex items-center justify-center">
                              {boon ? (
                                <img src={boon.iconUrl} alt={boon.name} className="w-8 h-8 object-cover rounded" />
                              ) : (
                                <img src={`/images/slots/${image}`} alt={`Empty ${label}`} className="w-8 h-8 object-cover rounded opacity-20 grayscale" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-[10px] text-gray-400">{slotDisplayNames[slot]}</div>
                              {boon ? (
                                <div className="text-xs text-white truncate">{boon.name}</div>
                              ) : (
                                <div className="text-xs text-gray-600 italic">Empty</div>
                              )}
                            </div>
                            {boon && (
                              <button
                                onClick={() => handleRemoveCoreBoon(slot)}
                                className="text-xs text-red-400 hover:text-red-300 px-1"
                              >
                                ×
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>

                {/* RIGHT COLUMN: Non-Core + Duo + Legendary */}
                <div className="space-y-3 flex flex-col">

                  {/* Non-Core Boons Pool */}
                  <div className="bg-gray-800/20 rounded-lg p-3 max-h-[180px] overflow-auto">
                    <div className="text-sm text-gray-400 mb-2">Non-Core ({selectedBuild.nonCoreBoons.length})</div>
                    {selectedBuild.nonCoreBoons.length > 0 ? (
                      <div className="grid grid-cols-3 gap-1.5">
                        {selectedBuild.nonCoreBoons.map(boon => (
                          <div key={boon.boonId} className="relative group">
                            <div
                              className={`w-full aspect-square rounded p-0.5 flex items-center justify-center cursor-pointer transition-all ${
                                isBoonPinned(boon)
                                  ? 'bg-purple-600/30 border-2 border-purple-500/70 shadow-lg shadow-purple-500/20'
                                  : 'bg-gray-700/30 border border-gray-600/50 hover:bg-gray-600/40'
                              }`}
                              onMouseEnter={() => setHoveredBoon(boon)}
                              onMouseLeave={() => setHoveredBoon(null)}
                              onClick={() => handlePinBoon(boon)}
                            >
                              <img src={boon.iconUrl} alt={boon.name} className="w-full h-full object-cover rounded" />
                            </div>
                            <button
                              onClick={() => handleRemoveNonCoreBoon(boon.boonId)}
                              className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-16 text-gray-600 text-xs italic">
                        None
                      </div>
                    )}
                  </div>

                  {/* Duo Boons */}
                  <div className={`rounded-lg p-3 border transition-all ${
                    eligibleDuoCount > 0
                      ? 'bg-yellow-900/20 border-yellow-500/50 shadow-lg shadow-yellow-500/20'
                      : selectedBuild.duoBoons.length > 0
                      ? 'bg-yellow-900/20 border-yellow-500/30'
                      : 'bg-yellow-900/10 border-yellow-500/20'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm text-yellow-300 font-semibold">Duo ({selectedBuild.duoBoons.length})</div>
                      {eligibleDuoCount > 0 && (
                        <div className="text-xs text-green-400 font-semibold">+{eligibleDuoCount} available</div>
                      )}
                    </div>
                    {selectedBuild.duoBoons.length > 0 ? (
                      <div className="flex gap-2 flex-wrap">
                        {selectedBuild.duoBoons.map(d => (
                          <div
                            key={d.boonId}
                            className={`w-10 h-10 rounded cursor-pointer transition-all ${
                              isBoonPinned(d)
                                ? 'bg-purple-600/30 border-2 border-purple-500/70 shadow-lg shadow-purple-500/20'
                                : 'bg-yellow-900/30 border border-yellow-500/40 hover:border-yellow-500/70'
                            }`}
                            onMouseEnter={() => setHoveredBoon(d)}
                            onMouseLeave={() => setHoveredBoon(null)}
                            onClick={() => handlePinBoon(d)}
                          >
                            <img src={d.iconUrl} alt={d.name} className="w-full h-full object-cover rounded" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-gray-600 italic py-2">None selected</div>
                    )}
                  </div>

                  {/* Legendary Boons */}
                  <div className={`rounded-lg p-3 border transition-all ${
                    eligibleLegendaryCount > 0
                      ? 'bg-orange-900/20 border-orange-500/50 shadow-lg shadow-orange-500/20'
                      : selectedBuild.legendaryBoons.length > 0
                      ? 'bg-orange-900/20 border-orange-500/30'
                      : 'bg-orange-900/10 border-orange-500/20'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm text-orange-300 font-semibold">Legendary ({selectedBuild.legendaryBoons.length})</div>
                      {eligibleLegendaryCount > 0 && (
                        <div className="text-xs text-green-400 font-semibold">+{eligibleLegendaryCount} available</div>
                      )}
                    </div>
                    {selectedBuild.legendaryBoons.length > 0 ? (
                      <div className="flex gap-2 flex-wrap">
                        {selectedBuild.legendaryBoons.map(l => (
                          <div
                            key={l.boonId}
                            className={`w-10 h-10 rounded cursor-pointer transition-all ${
                              isBoonPinned(l)
                                ? 'bg-purple-600/30 border-2 border-purple-500/70 shadow-lg shadow-purple-500/20'
                                : 'bg-orange-900/30 border border-orange-500/40 hover:border-orange-500/70'
                            }`}
                            onMouseEnter={() => setHoveredBoon(l)}
                            onMouseLeave={() => setHoveredBoon(null)}
                            onClick={() => handlePinBoon(l)}
                          >
                            <img src={l.iconUrl} alt={l.name} className="w-full h-full object-cover rounded" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-gray-600 italic py-2">None selected</div>
                    )}
                  </div>

                  {/* Infusions */}
                  <div className={`rounded-lg p-3 border transition-all bg-purple-900/10 border-purple-500/20`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm text-purple-300 font-semibold">Infusions (0)</div>
                    </div>
                    <div className="text-xs text-gray-600 italic py-2">None selected</div>
                  </div>

                </div>
              </div>
            </div>

            {/* ===== COLUMN 2: RADIAL/LIST VIEW ===== */}
            <div className="bg-gray-900/60 backdrop-blur-sm border border-purple-500/30 rounded-xl p-4 h-full overflow-hidden flex flex-col">

              {/* View Toggle */}
              <div className="flex items-center mb-4">
                <div className="flex-1"></div>
                <img src="/images/Other/boon_logo.webp" alt="Boon" className="h-10 w-10" />
                <div className="flex-1 flex justify-end">
                  <button
                    onClick={handleToggleView}
                    className="px-3 py-1.5 bg-purple-600/20 hover:bg-purple-600/30 rounded-lg border border-purple-500/40 transition-colors text-xs text-purple-300 font-medium"
                  >
                    {viewMode === 'radial' ? '📋 List View' : '⭕ Radial View'}
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-auto">
                {viewMode === 'radial' ? (
                  // RADIAL VIEW: Dual Radial Menus (Placeholder)
                  <div className="grid grid-cols-2 gap-6 h-full">
                    <div className="bg-gray-800/20 rounded-lg border border-purple-500/20 flex flex-col items-center justify-center p-8">
                      <div className="text-lg font-semibold text-purple-300 mb-4">Core Boons</div>
                      <div className="text-sm text-gray-400 text-center mb-6">slot → god → boon</div>
                      <div className="w-48 h-48 rounded-full border-2 border-dashed border-purple-500/30 flex items-center justify-center">
                        <div className="text-gray-500 text-center">
                          <div className="text-3xl mb-2">⚔️</div>
                          <div className="text-xs">Coming Soon</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-800/20 rounded-lg border border-blue-500/20 flex flex-col items-center justify-center p-8">
                      <div className="text-lg font-semibold text-blue-300 mb-4">Non-Core Boons</div>
                      <div className="text-sm text-gray-400 text-center mb-6">category → god → boon</div>
                      <div className="w-48 h-48 rounded-full border-2 border-dashed border-blue-500/30 flex items-center justify-center">
                        <div className="text-gray-500 text-center">
                          <div className="text-3xl mb-2">✨</div>
                          <div className="text-xs">Coming Soon</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // LIST VIEW: Gods + Boons Grid
                  <div className="space-y-6">
                    {[
                      { type: GodType.CoreGods, label: 'Core Gods', color: 'purple' },
                      { type: GodType.NonStandardGods, label: 'Non-Standard Gods', color: 'blue' },
                      { type: GodType.NPCGods, label: 'NPC Gods', color: 'green' },
                      { type: GodType.Allies, label: 'Allies', color: 'yellow' }
                    ].map(({ type, label, color }) => {
                      const gods = getGodsByType(type);
                      return (
                        <div key={type}>
                          <div className={`text-sm font-semibold text-${color}-300 mb-3 text-center`}>{label}</div>
                          <div className="grid grid-cols-5 gap-3">
                            {gods.map(god => (
                              <button
                                key={god.godId}
                                className="flex flex-col items-center p-3 rounded-lg bg-gray-700/30 hover:bg-gray-600/40 border border-gray-600/30 transition-colors"
                                title={god.description}
                              >
                                <ImageWithFallback src={god.iconUrl} alt={god.name} className="w-12 h-12 rounded object-cover mb-2" fallbackIcon="👤" />
                                <div className="text-xs text-white truncate w-full text-center">{god.name}</div>
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}

                    {/* Sample Non-Core Boons */}
                    <div>
                      <div className="text-sm font-semibold text-gray-300 mb-3 text-center">Sample Non-Core Boons (Click to Add)</div>
                      <div className="grid grid-cols-4 gap-2">
                        {mockNonCoreBoons.slice(0, 16).map(boon => (
                          <button
                            key={boon.boonId}
                            onClick={() => handleSelectNonCoreBoon(boon)}
                            onMouseEnter={() => setHoveredBoon(boon)}
                            onMouseLeave={() => setHoveredBoon(null)}
                            className="flex flex-col items-center p-2 rounded bg-gray-700/30 hover:bg-gray-600/40 border border-gray-600/30 transition-colors"
                          >
                            <ImageWithFallback src={boon.iconUrl} alt={boon.name} className="w-10 h-10 rounded object-cover mb-1" fallbackIcon="✨" />
                            <div className="text-[10px] text-white truncate w-full text-center">{boon.name}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ===== COLUMN 3: BOON DETAILS + BUILD CONTROLS ===== */}
            <div className="space-y-3 h-full flex flex-col">

              {/* Boon Details (Top - 50%) */}
              <div className="flex-1 min-h-0">
                <BoonDetailsPanel
                  boon={hoveredBoon || pinnedBoon}
                  isPinned={!!pinnedBoon && (!hoveredBoon || (hoveredBoon.boonId === pinnedBoon.boonId))}
                  onClearPin={handleClearPin}
                />
              </div>

              {/* Build Controls (Bottom - 50%) */}
              <div className="flex-1 min-h-0 overflow-auto">
                <BuildControlsPanel
                  buildName={selectedBuild.name}
                  buildDescription={selectedBuild.description}
                  isFavorite={selectedBuild.isFavorite}
                  difficulty={selectedBuild.difficulty}
                  tier={selectedBuild.tier}
                  onNameChange={(name) => setSelectedBuild({ ...selectedBuild, name })}
                  onDescriptionChange={(description) => setSelectedBuild({ ...selectedBuild, description })}
                  onFavoriteToggle={() => setSelectedBuild({ ...selectedBuild, isFavorite: !selectedBuild.isFavorite })}
                  onDifficultyChange={(difficulty) => setSelectedBuild({ ...selectedBuild, difficulty })}
                  onTierChange={(tier) => setSelectedBuild({ ...selectedBuild, tier })}
                  onSave={handleSaveBuild}
                />
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BoonBuilderV2;
