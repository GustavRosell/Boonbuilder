/**
 * EnhancedRadialMenu Component
 *
 * Main orchestrator for the interactive radial menu system
 * Features:
 * - Tab system (Core | Non-Core | Special Boons)
 * - Smart navigation (eliminates wasteful single-item menus)
 * - God-specific theming
 * - Smooth morphing animations
 */

import React, { useState } from 'react';
import { God, Boon, BoonSlot, AvailableBoon } from '../types';
import { GodType } from '../data/mockBoonData';
import RadialLayout from './RadialLayout';
import RadialCenterDisplay from './RadialCenterDisplay';
import { RadialItem } from './RadialItemCard';
import { getGodColor } from '../utils/radialUtils';

interface EnhancedRadialMenuProps {
  // Data
  gods: God[];
  boons: Boon[];
  nonCoreBoons: Boon[];
  availableDuoBoons: AvailableBoon[];
  availableLegendaryBoons: AvailableBoon[];

  // State
  selectedCoreBoons: Map<BoonSlot, Boon>;
  selectedNonCoreBoons: Boon[];
  selectedDuoBoons: AvailableBoon[];
  selectedLegendaryBoons: AvailableBoon[];

  // Callbacks
  onSelectCoreBoon: (slot: BoonSlot, boon: Boon) => void;
  onSelectNonCoreBoon: (boon: Boon) => void;
  onSelectDuoBoon: (boon: AvailableBoon) => void;
  onSelectLegendaryBoon: (boon: AvailableBoon) => void;

  // UI State (from parent for details panel sync)
  setHoveredBoon: (boon: Boon | AvailableBoon | null) => void;
}

type Tab = 'core' | 'non-core' | 'special';

const EnhancedRadialMenu: React.FC<EnhancedRadialMenuProps> = ({
  gods,
  boons,
  nonCoreBoons,
  availableDuoBoons,
  availableLegendaryBoons,
  selectedCoreBoons,
  selectedNonCoreBoons,
  selectedDuoBoons,
  selectedLegendaryBoons,
  onSelectCoreBoon,
  onSelectNonCoreBoon,
  onSelectDuoBoon,
  onSelectLegendaryBoon,
  setHoveredBoon
}) => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<Tab>('core');
  const [navLevel, setNavLevel] = useState<1 | 2 | 3>(1);
  const [selectedSlot, setSelectedSlot] = useState<BoonSlot | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<GodType | null>(null);
  const [selectedGod, setSelectedGod] = useState<God | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Available slots for core boons
  const CORE_SLOTS: { slot: BoonSlot; name: string; icon: string }[] = [
    { slot: BoonSlot.Attack, name: 'Attack', icon: '/images/slots/attack.png' },
    { slot: BoonSlot.Special, name: 'Special', icon: '/images/slots/special.png' },
    { slot: BoonSlot.Cast, name: 'Cast', icon: '/images/slots/cast.png' },
    { slot: BoonSlot.Sprint, name: 'Sprint', icon: '/images/slots/sprint.png' },
    { slot: BoonSlot.Magick, name: 'Magick', icon: '/images/slots/magicka.png' }
  ];

  // God categories for non-core
  const GOD_CATEGORIES: { type: GodType; name: string; icon: string }[] = [
    { type: GodType.CoreGods, name: 'Core Gods', icon: '/images/Other/boon_logo.webp' },
    { type: GodType.NonStandardGods, name: 'Non-Standard', icon: '/images/Other/boon_logo.webp' },
    { type: GodType.NPCGods, name: 'NPC Gods', icon: '/images/Other/boon_logo.webp' },
    { type: GodType.Allies, name: 'Allies', icon: '/images/Other/boon_logo.webp' }
  ];

  // ========== DATA FILTERING ==========

  const getCurrentItems = (): RadialItem[] => {
    if (activeTab === 'core') {
      if (navLevel === 1) {
        // Level 1: Show slots
        return CORE_SLOTS.map(({ slot, name, icon }) => ({
          id: `slot-${slot}`,
          type: 'slot' as const,
          primaryIcon: icon,
          primaryLabel: name,
          isSelected: selectedCoreBoons.has(slot)
        }));
      }

      if (navLevel === 2 && selectedSlot !== null) {
        // Level 2: Show gods with their boon for selected slot (DUAL ICON)
        const godsWithBoons = gods
          .map(god => {
            const boon = boons.find(b =>
              b.god?.godId === god.godId && b.slot === selectedSlot
            );
            return { god, boon };
          })
          .filter(({ boon }) => boon !== undefined);

        return godsWithBoons.map(({ god, boon }) => ({
          id: `god-${god.godId}`,
          type: 'god' as const,
          primaryIcon: god.iconUrl,
          primaryLabel: god.name,
          secondaryIcon: boon!.iconUrl,
          secondaryLabel: boon!.name,
          godName: god.name,
          color: getGodColor(god.name),
          isSelected: selectedCoreBoons.get(selectedSlot)?.boonId === boon!.boonId
        }));
      }
    }

    if (activeTab === 'non-core') {
      if (navLevel === 1) {
        // Level 1: Show categories
        return GOD_CATEGORIES.map(({ type, name, icon }) => ({
          id: `category-${type}`,
          type: 'category' as const,
          primaryIcon: icon,
          primaryLabel: name
        }));
      }

      if (navLevel === 2 && selectedCategory !== null) {
        // Level 2: Show gods in selected category with representative boon
        const godsInCategory = gods.filter(god => {
          // TODO: Once god.godType is available, filter by that
          // For now, show all gods
          return true;
        });

        return godsInCategory.map(god => {
          const representativeBoon = nonCoreBoons.find(b => b.god?.godId === god.godId);
          return {
            id: `god-${god.godId}`,
            type: 'god' as const,
            primaryIcon: god.iconUrl,
            primaryLabel: god.name,
            secondaryIcon: representativeBoon?.iconUrl,
            secondaryLabel: representativeBoon?.name || 'Boons',
            godName: god.name,
            color: getGodColor(god.name)
          };
        });
      }

      if (navLevel === 3 && selectedGod !== null) {
        // Level 3: Show all non-core boons from selected god
        const godBoons = nonCoreBoons.filter(b => b.god?.godId === selectedGod.godId);

        return godBoons.map(boon => ({
          id: `boon-${boon.boonId}`,
          type: 'boon' as const,
          primaryIcon: boon.iconUrl,
          primaryLabel: boon.name,
          godName: selectedGod.name,
          color: getGodColor(selectedGod.name),
          isSelected: selectedNonCoreBoons.some(b => b.boonId === boon.boonId)
        }));
      }
    }

    if (activeTab === 'special') {
      // Single level: Show all duo + legendary boons
      const allSpecialBoons = [...availableDuoBoons, ...availableLegendaryBoons];

      return allSpecialBoons.map(boon => ({
        id: `special-${boon.boonId}`,
        type: 'boon' as const,
        primaryIcon: boon.iconUrl,
        primaryLabel: boon.name,
        isLocked: !boon.isAvailable,
        tooltipText: !boon.isAvailable ? 'Prerequisites not met' : undefined,
        isSelected:
          selectedDuoBoons.some(b => b.boonId === boon.boonId) ||
          selectedLegendaryBoons.some(b => b.boonId === boon.boonId)
      }));
    }

    return [];
  };

  // ========== EVENT HANDLERS ==========

  const handleItemClick = (item: RadialItem) => {
    if (activeTab === 'core') {
      if (navLevel === 1) {
        // Clicked a slot → Go to level 2 (gods)
        const slotId = parseInt(item.id.split('-')[1]);
        setSelectedSlot(slotId);
        setNavLevel(2);
      } else if (navLevel === 2 && selectedSlot !== null) {
        // Clicked a god → Add boon immediately (smart flow!)
        const godId = parseInt(item.id.split('-')[1]);
        const god = gods.find(g => g.godId === godId);
        const boon = boons.find(b =>
          b.god?.godId === godId && b.slot === selectedSlot
        );

        if (god && boon) {
          onSelectCoreBoon(selectedSlot, boon);
          // Return to level 1
          setNavLevel(1);
          setSelectedSlot(null);
        }
      }
    }

    if (activeTab === 'non-core') {
      if (navLevel === 1) {
        // Clicked a category → Go to level 2 (gods)
        const categoryType = parseInt(item.id.split('-')[1]) as GodType;
        setSelectedCategory(categoryType);
        setNavLevel(2);
      } else if (navLevel === 2) {
        // Clicked a god → Go to level 3 (boons)
        const godId = parseInt(item.id.split('-')[1]);
        const god = gods.find(g => g.godId === godId);
        if (god) {
          setSelectedGod(god);
          setNavLevel(3);
        }
      } else if (navLevel === 3) {
        // Clicked a boon → Add to build
        const boonId = parseInt(item.id.split('-')[1]);
        const boon = nonCoreBoons.find(b => b.boonId === boonId);
        if (boon) {
          onSelectNonCoreBoon(boon);
          // Return to level 1
          setNavLevel(1);
          setSelectedCategory(null);
          setSelectedGod(null);
        }
      }
    }

    if (activeTab === 'special') {
      // Direct selection
      const boonId = parseInt(item.id.split('-')[1]);
      const boon = [...availableDuoBoons, ...availableLegendaryBoons].find(
        b => b.boonId === boonId
      );

      if (boon && boon.isAvailable) {
        if (boon.type === 'Duo') {
          onSelectDuoBoon(boon);
        } else {
          onSelectLegendaryBoon(boon);
        }
      }
    }
  };

  const handleItemHover = (item: RadialItem | null, index: number | null) => {
    setHoveredIndex(index);

    // Sync hover with BoonDetailsPanel (right column)
    if (!item) {
      setHoveredBoon(null);
      return;
    }

    // Handle 'god' type items (dual-icon cards showing god + boon)
    if (item.type === 'god') {
      if (activeTab === 'core' && navLevel === 2 && selectedSlot !== null) {
        // Find the boon for this god at the selected slot
        const godId = parseInt(item.id.split('-')[1]);
        const boon = boons.find(b => b.god?.godId === godId && b.slot === selectedSlot);
        setHoveredBoon(boon || null);
      } else if (activeTab === 'non-core' && navLevel === 2) {
        // At level 2, just hovering god - could show first non-core boon
        const godId = parseInt(item.id.split('-')[1]);
        const boon = nonCoreBoons.find(b => b.god?.godId === godId);
        setHoveredBoon(boon || null);
      }
      return;
    }

    // Handle 'boon' type items
    if (item.type === 'boon') {
      const boonId = parseInt(item.id.split('-')[1]);

      if (activeTab === 'non-core' && navLevel === 3) {
        const boon = nonCoreBoons.find(b => b.boonId === boonId);
        setHoveredBoon(boon || null);
      } else if (activeTab === 'special') {
        const boon = [...availableDuoBoons, ...availableLegendaryBoons].find(
          b => b.boonId === boonId
        );
        setHoveredBoon(boon || null);
      }
      return;
    }

    // For other types (slot, category), clear hover
    setHoveredBoon(null);
  };

  const handleBack = () => {
    if (navLevel === 3) {
      setNavLevel(2);
      setSelectedGod(null);
    } else if (navLevel === 2) {
      setNavLevel(1);
      setSelectedSlot(null);
      setSelectedCategory(null);
    }
  };

  const handleTabChange = (tab: Tab) => {
    // Reset navigation when switching tabs
    setActiveTab(tab);
    setNavLevel(1);
    setSelectedSlot(null);
    setSelectedCategory(null);
    setSelectedGod(null);
    setHoveredIndex(null);
    setHoveredBoon(null);
  };

  const currentItems = getCurrentItems();
  const hoveredItem = hoveredIndex !== null ? currentItems[hoveredIndex] : null;

  return (
    <div className="w-full h-full flex flex-col">
      {/* Tab Bar */}
      <div className="flex justify-center gap-3 mb-4">
        <button
          onClick={() => handleTabChange('core')}
          className={`
            px-5 py-2.5 rounded-lg transition-all text-sm font-medium
            ${activeTab === 'core'
              ? 'bg-purple-600/50 border-3 border-purple-400 text-purple-100 shadow-lg shadow-purple-500/50 scale-105'
              : 'bg-gray-800/40 border-2 border-gray-600 text-gray-400 hover:bg-gray-700/40'
            }
          `}
        >
          ⚔️ Core Boons
        </button>
        <button
          onClick={() => handleTabChange('non-core')}
          className={`
            px-5 py-2.5 rounded-lg transition-all text-sm font-medium
            ${activeTab === 'non-core'
              ? 'bg-purple-600/50 border-3 border-purple-400 text-purple-100 shadow-lg shadow-purple-500/50 scale-105'
              : 'bg-gray-800/40 border-2 border-gray-600 text-gray-400 hover:bg-gray-700/40'
            }
          `}
        >
          ✨ Non-Core Boons
        </button>
        <button
          onClick={() => handleTabChange('special')}
          className={`
            px-5 py-2.5 rounded-lg transition-all text-sm font-medium
            ${activeTab === 'special'
              ? 'bg-purple-600/50 border-3 border-purple-400 text-purple-100 shadow-lg shadow-purple-500/50 scale-105'
              : 'bg-gray-800/40 border-2 border-gray-600 text-gray-400 hover:bg-gray-700/40'
            }
          `}
        >
          👑 Special Boons
        </button>
      </div>

      {/* Radial Display */}
      <div className="flex-1 relative">
        <RadialLayout
          items={currentItems}
          onItemClick={handleItemClick}
          onItemHover={handleItemHover}
          hoveredIndex={hoveredIndex}
        />

        <RadialCenterDisplay
          hoveredItem={hoveredItem}
          navigationState={{
            tab: activeTab,
            level: navLevel,
            selectedSlot: selectedSlot ?? undefined,
            selectedCategory: selectedCategory?.toString(),
            selectedGodName: selectedGod?.name
          }}
          onBack={handleBack}
        />
      </div>
    </div>
  );
};

export default EnhancedRadialMenu;
