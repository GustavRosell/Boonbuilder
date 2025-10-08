import React from 'react';
import LoadoutSlot from './LoadoutSlot';
import ImageWithFallback from './ImageWithFallback';
import { BoonSlot, BuildState, Boon, AvailableBoon } from '../types';
import { isBoonAlreadySelected } from '../utils/boonPrerequisites';

interface LoadoutPanelProps {
  selectedBuild: BuildState;
  onRemoveBoon: (slot: BoonSlot) => void;
  onRemoveWeapon: () => void;
  onRemoveFamiliar: () => void;
  onRemoveDuoBoon: (boonId: number) => void;
  onRemoveLegendaryBoon: (boonId: number) => void;
  onRemoveNonCoreBoon: (boonId: number) => void;
  onBuildNameChange: (name: string) => void;
  onBuildDescriptionChange: (description: string) => void;

  // NEW props to display the pool and special boons like ingame
  boons: Boon[]; // full boon list pulled by parent (BoonBuilder)
  availableDuoBoons: AvailableBoon[]; // computed availability (available + locked)
  availableLegendaryBoons: AvailableBoon[];
  onSelectBoon: (boon: Boon, slot: BoonSlot) => void;
  onSelectDuoBoon: (boon: AvailableBoon) => void;
  onSelectLegendaryBoon: (boon: AvailableBoon) => void;
}

const LoadoutPanel: React.FC<LoadoutPanelProps> = ({
  selectedBuild,
  onRemoveBoon,
  onRemoveWeapon,
  onRemoveFamiliar,
  onRemoveDuoBoon,
  onRemoveLegendaryBoon,
  onRemoveNonCoreBoon,
  onBuildNameChange,
  onBuildDescriptionChange,

  // NEW
  boons,
  availableDuoBoons,
  availableLegendaryBoons,
  onSelectBoon,
  onSelectDuoBoon,
  onSelectLegendaryBoon
}) => {
  // Pool: all boons that are not selected (core + non-core) — this fills the empty area
  const poolBoons = boons.filter(b => !isBoonAlreadySelected(b.boonId, selectedBuild.boons, selectedBuild.duoBoons, selectedBuild.legendaryBoons));

  return (
    <div className="w-[900px] bg-gray-900/60 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6 h-full flex flex-col">
      <h2 className="text-2xl font-bold text-purple-300 mb-4 text-center">Loadout — Game Board</h2>

      <div className="flex gap-6 flex-1 overflow-hidden">
        {/* LEFT: GAME BOARD (weapon + core slots) */}
        <div className="w-[320px] flex flex-col items-center gap-6">
          {/* Weapon */}
          <LoadoutSlot
            slotType="weapon"
            slotName="Weapon"
            selectedItem={selectedBuild.weapon}
            selectedAspect={selectedBuild.aspect}
            onRemove={selectedBuild.weapon ? onRemoveWeapon : undefined}
            emptyIcon="/images/slots/weapon.png"
            emptyLabel="No Weapon"
            variant="large"
          />

          {/* Familiar */}
          <LoadoutSlot
            slotType="familiar"
            slotName="Familiar"
            selectedItem={selectedBuild.familiar}
            selectedFamiliarAbility={selectedBuild.familiarAbility}
            onRemove={selectedBuild.familiar ? onRemoveFamiliar : undefined}
            emptyIcon="/images/slots/familiar.png"
            emptyLabel="No Familiar"
            variant="large"
          />

          {/* Core slots vertically stacked (game-like) */}
          <div className="w-full bg-gray-800/20 rounded-lg p-4 flex flex-col items-center gap-3">
            <div className="text-sm text-gray-400 mb-1">Core Boons</div>
            <div className="flex flex-col gap-3 w-full">
              {[
                { slot: BoonSlot.Attack, label: 'Attack' },
                { slot: BoonSlot.Special, label: 'Special' },
                { slot: BoonSlot.Cast, label: 'Cast' },
                { slot: BoonSlot.Sprint, label: 'Sprint' },
                { slot: BoonSlot.Magick, label: 'Magicka' }
              ].map(s => (
                <LoadoutSlot
                  key={s.slot}
                  slotType="boon"
                  slotName={s.label}
                  boonSlot={s.slot}
                  selectedItem={selectedBuild.boons.get(s.slot)}
                  onRemove={selectedBuild.boons.has(s.slot) ? () => onRemoveBoon(s.slot) : undefined}
                  emptyIcon={`/images/slots/${s.label.toLowerCase()}.png`}
                  emptyLabel="Empty Slot"
                  variant="large"
                />
              ))}
            </div>
            <div className="text-xs text-gray-400 mt-2">Empty slot templates show available pool on the right.</div>
          </div>

          {/* Selected Duo / Legendary quick view (compact) */}
          <div className="w-full space-y-2">
            <div className="text-sm text-yellow-300 font-semibold">Duo / Legendary (Quick view)</div>
            <div className="flex gap-2 flex-wrap">
              {selectedBuild.duoBoons.map(d => (
                <div key={d.boonId} className="w-10 h-10 rounded-lg bg-yellow-900/20 border border-yellow-500/30 flex items-center justify-center">
                  <ImageWithFallback src={d.iconUrl} alt={d.name} className="w-8 h-8 rounded object-cover" fallbackIcon="🤝" />
                </div>
              ))}
              {selectedBuild.legendaryBoons.map(l => (
                <div key={l.boonId} className="w-10 h-10 rounded-lg bg-orange-900/20 border border-orange-500/30 flex items-center justify-center">
                  <ImageWithFallback src={l.iconUrl} alt={l.name} className="w-8 h-8 rounded object-cover" fallbackIcon="⭐" />
                </div>
              ))}
              {(selectedBuild.duoBoons.length === 0 && selectedBuild.legendaryBoons.length === 0) && (
                <div className="text-xs text-gray-400">No special boons selected</div>
              )}
            </div>
          </div>
        </div>

        {/* CENTER / RIGHT: POOL & SPECIAL BOONS */}
        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
          {/* Available/Pool boons — grid of all non-selected boons (click to assign) */}
          <div className="bg-gray-800/30 rounded-lg p-4 flex-1 overflow-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-purple-200">Available Boons</h3>
              <div className="text-sm text-gray-400">Click a boon to place it (core boons will auto-fill their slot)</div>
            </div>

            <div className="grid grid-cols-6 gap-2">
              {poolBoons.map((boon) => (
                <button
                  key={boon.boonId}
                  onClick={() => boon.slot && onSelectBoon(boon, boon.slot)}
                  className={`group relative p-2 rounded-lg flex flex-col items-center justify-center
                    ${boon.type === 0 ? 'border border-purple-600/30 bg-gradient-to-br from-purple-900/6 to-blue-900/6' : 'bg-gray-900/20 border border-gray-700/40'}
                    hover:scale-105 transition-transform`}
                  title={`${boon.name} — ${boon.god?.name || ''}`}
                >
                  <ImageWithFallback src={boon.iconUrl} alt={boon.name} className="w-10 h-10 rounded object-cover" fallbackIcon={boon.name.charAt(0)} />
                  <div className="text-xs text-gray-300 mt-1 truncate w-full text-center">{boon.name}</div>
                  {boon.type === 0 && (
                    <div className="absolute -top-2 left-2 text-[10px] bg-gray-800 px-1 rounded text-purple-300 border border-purple-500/20">
                      CORE
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Duo & Legendary grids (compact cards with locked state) */}
          <div className="flex gap-3">
            <div className="flex-1 bg-yellow-900/10 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-yellow-300 font-semibold">Duo Boons</h4>
                <div className="text-sm text-gray-400">{availableDuoBoons.length}</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {availableDuoBoons.map(d => (
                  <button
                    key={d.boonId}
                    onClick={() => d.isAvailable && onSelectDuoBoon(d)}
                    className={`p-2 rounded-lg flex items-center gap-2 border ${
                      d.isAvailable ? 'border-yellow-400 bg-yellow-900/20 shadow-sm' : 'border-gray-700 bg-gray-800/20 opacity-50'
                    }`}
                    title={d.name}
                  >
                    <ImageWithFallback src={d.iconUrl} alt={d.name} className="w-8 h-8 rounded object-cover" fallbackIcon="🤝" />
                    <div className="text-xs text-white truncate">{d.name}</div>
                    {!d.isAvailable && <div className="ml-auto text-[10px] text-yellow-300 px-1">Locked</div>}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 bg-orange-900/10 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-orange-300 font-semibold">Legendary Boons</h4>
                <div className="text-sm text-gray-400">{availableLegendaryBoons.length}</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {availableLegendaryBoons.map(l => (
                  <button
                    key={l.boonId}
                    onClick={() => l.isAvailable && onSelectLegendaryBoon(l)}
                    className={`p-2 rounded-lg flex items-center gap-2 border ${
                      l.isAvailable ? 'border-orange-400 bg-orange-900/20 shadow-sm' : 'border-gray-700 bg-gray-800/20 opacity-50'
                    }`}
                    title={l.name}
                  >
                    <ImageWithFallback src={l.iconUrl} alt={l.name} className="w-8 h-8 rounded object-cover" fallbackIcon="⭐" />
                    <div className="text-xs text-white truncate">{l.name}</div>
                    {!l.isAvailable && <div className="ml-auto text-[10px] text-orange-300 px-1">Locked</div>}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Build Details Section - Full Width (unchanged) */}
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