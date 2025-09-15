import React from 'react';
import { X } from 'lucide-react';
import LoadoutSlot from './LoadoutSlot';
import { BoonSlot, BuildState } from '../types';

interface LoadoutPanelProps {
  selectedBuild: BuildState;
  onRemoveBoon: (slot: BoonSlot) => void;
  onRemoveWeapon: () => void;
  onRemovePet: () => void;
  onRemoveDuoBoon: (boonId: number) => void;
  onRemoveLegendaryBoon: (boonId: number) => void;
  onBuildNameChange: (name: string) => void;
  onBuildDescriptionChange: (description: string) => void;
}

const LoadoutPanel: React.FC<LoadoutPanelProps> = ({
  selectedBuild,
  onRemoveBoon,
  onRemoveWeapon,
  onRemovePet,
  onRemoveDuoBoon,
  onRemoveLegendaryBoon,
  onBuildNameChange,
  onBuildDescriptionChange
}) => {
  // Ordered slots as specified: Weapon → Pet → Attack → Special → Cast → Sprint → Magicka
  const orderedSlots = [
    {
      slotType: 'weapon' as const,
      slotName: 'Weapon',
      selectedItem: selectedBuild.weapon,
      selectedAspect: selectedBuild.aspect,
      onRemove: selectedBuild.weapon ? onRemoveWeapon : undefined,
      emptyIcon: '/images/slots/weapon.png', // We may need to create this
      emptyLabel: 'No Weapon'
    },
    {
      slotType: 'pet' as const,
      slotName: 'Pet',
      selectedItem: selectedBuild.pet,
      onRemove: selectedBuild.pet ? onRemovePet : undefined,
      emptyIcon: '/images/slots/pet.png',
      emptyLabel: 'No Pet'
    },
    {
      slotType: 'boon' as const,
      slotName: 'Attack',
      boonSlot: BoonSlot.Attack,
      selectedItem: selectedBuild.boons.get(BoonSlot.Attack),
      onRemove: selectedBuild.boons.has(BoonSlot.Attack) ? () => onRemoveBoon(BoonSlot.Attack) : undefined,
      emptyIcon: '/images/slots/attack.png',
      emptyLabel: 'Empty Slot'
    },
    {
      slotType: 'boon' as const,
      slotName: 'Special',
      boonSlot: BoonSlot.Special,
      selectedItem: selectedBuild.boons.get(BoonSlot.Special),
      onRemove: selectedBuild.boons.has(BoonSlot.Special) ? () => onRemoveBoon(BoonSlot.Special) : undefined,
      emptyIcon: '/images/slots/special.png',
      emptyLabel: 'Empty Slot'
    },
    {
      slotType: 'boon' as const,
      slotName: 'Cast',
      boonSlot: BoonSlot.Cast,
      selectedItem: selectedBuild.boons.get(BoonSlot.Cast),
      onRemove: selectedBuild.boons.has(BoonSlot.Cast) ? () => onRemoveBoon(BoonSlot.Cast) : undefined,
      emptyIcon: '/images/slots/cast.png',
      emptyLabel: 'Empty Slot'
    },
    {
      slotType: 'boon' as const,
      slotName: 'Sprint',
      boonSlot: BoonSlot.Sprint,
      selectedItem: selectedBuild.boons.get(BoonSlot.Sprint),
      onRemove: selectedBuild.boons.has(BoonSlot.Sprint) ? () => onRemoveBoon(BoonSlot.Sprint) : undefined,
      emptyIcon: '/images/slots/sprint.png',
      emptyLabel: 'Empty Slot'
    },
    {
      slotType: 'boon' as const,
      slotName: 'Magicka',
      boonSlot: BoonSlot.Magick,
      selectedItem: selectedBuild.boons.get(BoonSlot.Magick),
      onRemove: selectedBuild.boons.has(BoonSlot.Magick) ? () => onRemoveBoon(BoonSlot.Magick) : undefined,
      emptyIcon: '/images/slots/magicka.png',
      emptyLabel: 'Empty Slot'
    }
  ];

  return (
    <div className="w-[640px] bg-gray-900/60 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6 h-full flex flex-col">
      <h2 className="text-2xl font-bold text-purple-300 mb-6 text-center">Current Loadout</h2>

      <div className="flex gap-6 flex-1 overflow-hidden">
        {/* Left Column - Main Loadout Slots */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-purple-300 mb-4">Main Loadout</h3>
          <div className="space-y-3 overflow-y-auto h-full">
            {orderedSlots.map((slot, index) => (
              <LoadoutSlot
                key={`${slot.slotType}-${slot.slotName}-${index}`}
                slotType={slot.slotType}
                slotName={slot.slotName}
                boonSlot={slot.boonSlot}
                selectedItem={slot.selectedItem}
                selectedAspect={slot.selectedAspect}
                onRemove={slot.onRemove}
                emptyIcon={slot.emptyIcon}
                emptyLabel={slot.emptyLabel}
              />
            ))}
          </div>
        </div>

        {/* Right Column - Special Boons & Additional Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-purple-300 mb-4">Special Boons</h3>
          <div className="overflow-y-auto h-full space-y-6">

            {/* Duo Boons Section */}
            <div className="bg-gray-800/30 rounded-lg p-4">
              <h4 className="text-base font-semibold text-yellow-300 mb-3 flex items-center">
                <span className="text-lg mr-2">🤝</span>
                Duo Boons {selectedBuild.duoBoons.length > 0 && `(${selectedBuild.duoBoons.length})`}
              </h4>
              {selectedBuild.duoBoons.length > 0 ? (
                <div className="space-y-3">
                  {selectedBuild.duoBoons.map((duoBoon) => (
                    <div key={duoBoon.boonId} className="flex items-center space-x-3 p-3 bg-yellow-900/20 rounded-lg border border-yellow-500/30">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-600/40 to-orange-600/40 border-2 border-yellow-400/60 flex items-center justify-center flex-shrink-0">
                        <img
                          src={duoBoon.iconUrl}
                          alt={duoBoon.name}
                          className="w-8 h-8 rounded object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-medium text-sm truncate">{duoBoon.name}</div>
                        <div className="text-xs text-yellow-300">
                          {duoBoon.firstGod?.name} + {duoBoon.secondGod?.name}
                        </div>
                        {duoBoon.description && (
                          <div className="text-xs text-gray-300 mt-1 line-clamp-2">{duoBoon.description}</div>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        {!duoBoon.isAvailable && (
                          <span className="text-[10px] uppercase tracking-wide bg-gray-800 text-yellow-300 px-2 py-0.5 rounded border border-yellow-500/30">
                            Locked
                          </span>
                        )}
                        <button
                          onClick={() => onRemoveDuoBoon(duoBoon.boonId)}
                          className="text-red-400 hover:text-red-300 transition-colors p-1 rounded hover:bg-red-900/30"
                          title="Remove Duo Boon"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No duo boons selected</p>
              )}
            </div>

            {/* Legendary Boons Section */}
            <div className="bg-gray-800/30 rounded-lg p-4">
              <h4 className="text-base font-semibold text-orange-300 mb-3 flex items-center">
                <span className="text-lg mr-2">⭐</span>
                Legendary Boons {selectedBuild.legendaryBoons.length > 0 && `(${selectedBuild.legendaryBoons.length})`}
              </h4>
              {selectedBuild.legendaryBoons.length > 0 ? (
                <div className="space-y-3">
                  {selectedBuild.legendaryBoons.map((legendaryBoon) => (
                    <div key={legendaryBoon.boonId} className="flex items-center space-x-3 p-3 bg-orange-900/20 rounded-lg border border-orange-500/30">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-600/40 to-red-600/40 border-2 border-orange-400/60 flex items-center justify-center flex-shrink-0">
                        <img
                          src={legendaryBoon.iconUrl}
                          alt={legendaryBoon.name}
                          className="w-8 h-8 rounded object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-medium text-sm truncate">{legendaryBoon.name}</div>
                        <div className="text-xs text-orange-300">{legendaryBoon.god?.name}</div>
                        {legendaryBoon.description && (
                          <div className="text-xs text-gray-300 mt-1 line-clamp-2">{legendaryBoon.description}</div>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        {!legendaryBoon.isAvailable && (
                          <span className="text-[10px] uppercase tracking-wide bg-gray-800 text-orange-300 px-2 py-0.5 rounded border border-orange-500/30">
                            Locked
                          </span>
                        )}
                        <button
                          onClick={() => onRemoveLegendaryBoon(legendaryBoon.boonId)}
                          className="text-red-400 hover:text-red-300 transition-colors p-1 rounded hover:bg-red-900/30"
                          title="Remove Legendary Boon"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No legendary boons selected</p>
              )}
            </div>

            {/* All Core Boons Summary Section */}
            <div className="bg-gray-800/30 rounded-lg p-4">
              <h4 className="text-base font-semibold text-purple-300 mb-3 flex items-center">
                <span className="text-lg mr-2">✨</span>
                Core Boons Summary
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {Array.from(selectedBuild.boons.entries()).map(([slot, boon]) => (
                  <div key={slot} className="flex items-center space-x-2 p-2 bg-purple-900/20 rounded border border-purple-500/30">
                    <div className="w-8 h-8 rounded bg-gradient-to-br from-purple-600/40 to-blue-600/40 border border-purple-400/60 flex items-center justify-center flex-shrink-0">
                      <img
                        src={boon.iconUrl}
                        alt={boon.name}
                        className="w-6 h-6 rounded object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-xs font-medium truncate">{boon.name}</div>
                      <div className="text-xs text-purple-300">{boon.god?.name}</div>
                    </div>
                  </div>
                ))}
                {selectedBuild.boons.size === 0 && (
                  <p className="text-gray-400 text-sm">No core boons selected</p>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Build Details Section - Full Width */}
      <div className="pt-4 border-t border-gray-700">
        <h3 className="text-lg font-semibold text-purple-300 mb-3">Build Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Build Name"
            value={selectedBuild.name}
            onChange={(e) => onBuildNameChange(e.target.value)}
            className="px-4 py-2 bg-gray-700/50 rounded-lg border border-purple-500/30
              focus:border-purple-400 focus:outline-none text-white placeholder-gray-400"
          />
          <button className="py-2 bg-gradient-to-r from-purple-600 to-blue-600
            hover:from-purple-700 hover:to-blue-700 rounded-lg font-semibold transition-all
            text-white shadow-lg hover:shadow-purple-500/25">
            Save Build
          </button>
        </div>
        <textarea
          placeholder="Build Description"
          rows={2}
          value={selectedBuild.description}
          onChange={(e) => onBuildDescriptionChange(e.target.value)}
          className="w-full px-4 py-2 bg-gray-700/50 rounded-lg border border-purple-500/30
            focus:border-purple-400 focus:outline-none mt-3 text-white placeholder-gray-400 resize-none"
        />
      </div>
    </div>
  );
};

export default LoadoutPanel;