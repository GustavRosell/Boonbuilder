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
  mockGods,
  GodType,
  getGodsByType
} from '../data/mockBoonData';
import { Keepsake } from '../data/mockKeepsakes';
import { ArcanaCard, calculateTotalGrasp, DEFAULT_MAX_GRASP } from '../data/mockArcanaCards';
import BuildControlsPanel from './BuildControlsPanel';
import BoonDetailsPanel from './BoonDetailsPanel';
import ImageWithFallback from './ImageWithFallback';
import LoadoutPanelV2 from './LoadoutPanelV2';
import KeepsakeModal from './KeepsakeModal';
import ArcanaCardModal from './ArcanaCardModal';
import EnhancedRadialMenu from './EnhancedRadialMenu';
import ParticleField from './ParticleField';

// ============================================================================
// MOCK CORE BOONS (TEMPORARY - FOR RADIAL MENU TESTING)
// ============================================================================

/**
 * Temporary mock core boons for testing the radial menu
 * TODO: Replace with real data from backend once available
 */
const mockCoreBoons: Boon[] = [
  // Zeus Attack
  { boonId: 1001, name: "Lightning Strike", type: 0, godId: 9, slot: BoonSlot.Attack, description: "Your Attack jolts foes", effect: "+40% damage", iconUrl: "/images/boons/Olympian_Gods/zeus/other/Zeus_Logo.png", isPassive: false, god: mockGods.find(g => g.godId === 9) },
  // Zeus Special
  { boonId: 1002, name: "Thunder Flourish", type: 0, godId: 9, slot: BoonSlot.Special, description: "Your Special jolts foes", effect: "+50% damage", iconUrl: "/images/boons/Olympian_Gods/zeus/other/Zeus_Logo.png", isPassive: false, god: mockGods.find(g => g.godId === 9) },
  // Aphrodite Attack
  { boonId: 1003, name: "Passion Dash", type: 0, godId: 1, slot: BoonSlot.Attack, description: "Your Attack inflicts Weak", effect: "+35% damage", iconUrl: "/images/boons/Olympian_Gods/aphrodite/other/Aphrodite_Logo.png", isPassive: false, god: mockGods.find(g => g.godId === 1) },
  // Aphrodite Special
  { boonId: 1004, name: "Passion Flare", type: 0, godId: 1, slot: BoonSlot.Special, description: "Your Special inflicts Weak", effect: "+45% damage", iconUrl: "/images/boons/Olympian_Gods/aphrodite/other/Aphrodite_Logo.png", isPassive: false, god: mockGods.find(g => g.godId === 1) },
  // Apollo Attack
  { boonId: 1005, name: "Nova Strike", type: 0, godId: 2, slot: BoonSlot.Attack, description: "Your Attack can Daze foes", effect: "+38% damage", iconUrl: "/images/boons/Olympian_Gods/apollo/other/Apollo_Logo.png", isPassive: false, god: mockGods.find(g => g.godId === 2) },
  // Apollo Cast
  { boonId: 1006, name: "Lucid Beam", type: 0, godId: 2, slot: BoonSlot.Cast, description: "Your Cast seeks foes", effect: "Homing projectile", iconUrl: "/images/boons/Olympian_Gods/apollo/other/Apollo_Logo.png", isPassive: false, god: mockGods.find(g => g.godId === 2) },
  // Hephaestus Special
  { boonId: 1007, name: "Volcanic Flourish", type: 0, godId: 5, slot: BoonSlot.Special, description: "Your Special causes explosions", effect: "+60% Blast damage", iconUrl: "/images/boons/Olympian_Gods/hephaestus/other/Hephaestus_Logo.png", isPassive: false, god: mockGods.find(g => g.godId === 5) },
  // Poseidon Attack
  { boonId: 1008, name: "Tempest Strike", type: 0, godId: 8, slot: BoonSlot.Attack, description: "Your Attack knocks foes away", effect: "+42% damage + knockback", iconUrl: "/images/boons/Olympian_Gods/poseidon/other/Poseidon_Logo.png", isPassive: false, god: mockGods.find(g => g.godId === 8) },
  // Demeter Cast
  { boonId: 1009, name: "Frost Strike", type: 0, godId: 4, slot: BoonSlot.Cast, description: "Your Cast inflicts Chill", effect: "Slows enemies", iconUrl: "/images/boons/Olympian_Gods/demeter/other/Demeter_Logo.png", isPassive: false, god: mockGods.find(g => g.godId === 4) },
  // Hera Sprint
  { boonId: 1010, name: "Royal Dash", type: 0, godId: 6, slot: BoonSlot.Sprint, description: "Your Sprint inflicts Hitch", effect: "Spreads damage", iconUrl: "/images/boons/Olympian_Gods/hera/other/Hera_Logo.png", isPassive: false, god: mockGods.find(g => g.godId === 6) },
];

// ============================================================================
// TYPES
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

/**
 * Extended BuildState with core/non-core separation, Keepsakes, and Arcana Cards
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
  keepsake: KeepsakeSelection | null;   // Single keepsake with rank
  arcanaCards: ArcanaCardSelection[];   // Multiple arcana cards with ranks
  maxGrasp: number;                     // Adjustable Grasp limit (10-30)
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
    keepsake: null,
    arcanaCards: [],
    maxGrasp: DEFAULT_MAX_GRASP,
    name: '',
    description: '',
    isFavorite: false,
    difficulty: BuildDifficulty.Medium,
    tier: BuildTier.B
  });

  const [viewMode, setViewMode] = useState<ViewMode>('radial');
  const [hoveredBoon, setHoveredBoon] = useState<Boon | AvailableBoon | null>(null);
  const [pinnedBoon, setPinnedBoon] = useState<Boon | AvailableBoon | null>(null);

  // Modal states
  const [isKeepsakeModalOpen, setIsKeepsakeModalOpen] = useState(false);
  const [isArcanaModalOpen, setIsArcanaModalOpen] = useState(false);

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

  const handleSelectCoreBoon = (slot: BoonSlot, boon: Boon) => {
    const newCoreBoons = new Map(selectedBuild.coreBoons);
    newCoreBoons.set(slot, boon);
    setSelectedBuild({ ...selectedBuild, coreBoons: newCoreBoons });
  };

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
    // Validate Grasp limit
    const currentGrasp = calculateTotalGrasp(selectedBuild.arcanaCards.map(s => s.card));
    if (currentGrasp > selectedBuild.maxGrasp) {
      alert(
        `Cannot save build: Your Arcana Cards use ${currentGrasp} Grasp, ` +
        `but your limit is ${selectedBuild.maxGrasp}. Please reduce your Grasp usage or increase your limit.`
      );
      return;
    }

    console.log('Saving build:', selectedBuild);
    // TODO: Implement actual save logic
    alert('Build save functionality coming soon!');
  };

  const handlePinBoon = (boon: Boon | AvailableBoon) => {
    // Toggle: if clicking the same boon, unpin it
    if (pinnedBoon && pinnedBoon.boonId === boon.boonId) {
      setPinnedBoon(null);
    } else {
      setPinnedBoon(boon);
    }
  };

  const handleClearPin = () => {
    setPinnedBoon(null);
  };

  // Keepsake & Arcana handlers
  const handleSelectKeepsake = (selection: KeepsakeSelection | null) => {
    setSelectedBuild({ ...selectedBuild, keepsake: selection });
  };

  const handleSelectArcanaCards = (selections: ArcanaCardSelection[]) => {
    setSelectedBuild({ ...selectedBuild, arcanaCards: selections });
  };

  const handleMaxGraspChange = (maxGrasp: number) => {
    setSelectedBuild({ ...selectedBuild, maxGrasp });
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
            <LoadoutPanelV2
              weapon={selectedBuild.weapon}
              aspect={selectedBuild.aspect}
              familiar={selectedBuild.familiar}
              familiarAbility={selectedBuild.familiarAbility}
              coreBoons={selectedBuild.coreBoons}
              nonCoreBoons={selectedBuild.nonCoreBoons}
              duoBoons={selectedBuild.duoBoons}
              legendaryBoons={selectedBuild.legendaryBoons}
              keepsake={selectedBuild.keepsake}
              arcanaCards={selectedBuild.arcanaCards}
              maxGrasp={selectedBuild.maxGrasp}
              onRemoveWeapon={() => setSelectedBuild({ ...selectedBuild, weapon: undefined, aspect: undefined })}
              onRemoveFamiliar={() => setSelectedBuild({ ...selectedBuild, familiar: undefined, familiarAbility: undefined })}
              onRemoveCoreBoon={handleRemoveCoreBoon}
              onRemoveNonCoreBoon={handleRemoveNonCoreBoon}
              onRemoveDuoBoon={(boonId) => setSelectedBuild({ ...selectedBuild, duoBoons: selectedBuild.duoBoons.filter(b => b.boonId !== boonId) })}
              onRemoveLegendaryBoon={(boonId) => setSelectedBuild({ ...selectedBuild, legendaryBoons: selectedBuild.legendaryBoons.filter(b => b.boonId !== boonId) })}
              onPinBoon={handlePinBoon}
              onOpenKeepsakeModal={() => setIsKeepsakeModalOpen(true)}
              onOpenArcanaModal={() => setIsArcanaModalOpen(true)}
              hoveredBoon={hoveredBoon}
              pinnedBoon={pinnedBoon}
              setHoveredBoon={setHoveredBoon}
              eligibleDuoCount={eligibleDuoCount}
              eligibleLegendaryCount={eligibleLegendaryCount}
            />

            {/* ===== COLUMN 2: RADIAL/LIST VIEW ===== */}
            <div className="bg-gray-900/60 backdrop-blur-sm border-2 border-purple-500/30 rounded-xl p-4 h-full overflow-hidden flex flex-col">

              {/* View Toggle */}
              <div className="flex items-center mb-4">
                <div className="flex-1"></div>
                <img src="/images/Other/boon_logo.webp" alt="Boon" className="h-10 w-10" />
                <div className="flex-1 flex justify-end">
                  <button
                    onClick={handleToggleView}
                    className="px-3 py-1.5 bg-purple-600/20 hover:bg-purple-600/30 rounded-lg border-2 border-purple-500/40 transition-colors text-xs text-purple-300 font-medium"
                  >
                    {viewMode === 'radial' ? '📋 List View' : '⭕ Radial View'}
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-auto">
                {viewMode === 'radial' ? (
                  // RADIAL VIEW: Enhanced Interactive Radial Menu
                  <div className="relative h-full flex items-center justify-center">
                    {/* Particle Field Background */}
                    <ParticleField particleCount={70} />

                    {/* Enhanced Radial Menu */}
                    <EnhancedRadialMenu
                      gods={mockGods}
                      boons={mockCoreBoons}
                      nonCoreBoons={mockNonCoreBoons}
                      availableDuoBoons={availableDuoBoons}
                      availableLegendaryBoons={availableLegendaryBoons}
                      selectedCoreBoons={selectedBuild.coreBoons}
                      selectedNonCoreBoons={selectedBuild.nonCoreBoons}
                      selectedDuoBoons={selectedBuild.duoBoons}
                      selectedLegendaryBoons={selectedBuild.legendaryBoons}
                      onSelectCoreBoon={handleSelectCoreBoon}
                      onSelectNonCoreBoon={handleSelectNonCoreBoon}
                      onSelectDuoBoon={handleSelectDuoBoon}
                      onSelectLegendaryBoon={handleSelectLegendaryBoon}
                      setHoveredBoon={setHoveredBoon}
                    />
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
                                className="flex flex-col items-center p-3 rounded-lg bg-gray-700/30 hover:bg-gray-600/40 border-2 border-purple-500/20 transition-colors"
                                title={god.description}
                              >
                                <ImageWithFallback key={god.iconUrl} src={god.iconUrl} alt={god.name} className="w-12 h-12 rounded object-cover mb-2" fallbackIcon="👤" />
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
                            className="flex flex-col items-center p-2 rounded bg-gray-700/30 hover:bg-gray-600/40 border-2 border-purple-500/20 transition-colors"
                          >
                            <ImageWithFallback key={boon.iconUrl} src={boon.iconUrl} alt={boon.name} className="w-10 h-10 rounded object-cover mb-1" fallbackIcon="✨" />
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

      {/* Modals */}
      <KeepsakeModal
        isOpen={isKeepsakeModalOpen}
        onClose={() => setIsKeepsakeModalOpen(false)}
        selectedKeepsake={selectedBuild.keepsake}
        onSelectKeepsake={handleSelectKeepsake}
      />

      <ArcanaCardModal
        isOpen={isArcanaModalOpen}
        onClose={() => setIsArcanaModalOpen(false)}
        selectedCards={selectedBuild.arcanaCards}
        onSelectCards={handleSelectArcanaCards}
        maxGrasp={selectedBuild.maxGrasp}
        onMaxGraspChange={handleMaxGraspChange}
      />
    </div>
  );
};

export default BoonBuilderV2;
