/**
 * KeepsakeModal Component
 *
 * Modal for selecting a single Keepsake with rank selection
 * Features:
 * - 6-column grid layout showing all 33 keepsakes
 * - Rank selector (1-3 + Heroic) - defaults to max rank
 * - Single selection with visual feedback
 * - Hover details panel showing full effects and bond messages
 */

import React, { useState, useMemo } from 'react';
import { Keepsake, KeepsakeCategory, mockKeepsakes } from '../data/mockKeepsakes';
import ImageWithFallback from './ImageWithFallback';

interface KeepsakeSelection {
  keepsake: Keepsake;
  rank: number; // 1-4 (4 = Heroic)
}

interface KeepsakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedKeepsake: KeepsakeSelection | null;
  onSelectKeepsake: (selection: KeepsakeSelection | null) => void;
}

const KeepsakeModal: React.FC<KeepsakeModalProps> = ({
  isOpen,
  onClose,
  selectedKeepsake,
  onSelectKeepsake
}) => {
  const [hoveredKeepsake, setHoveredKeepsake] = useState<Keepsake | null>(null);
  const [selectedRank, setSelectedRank] = useState<number>(3); // Default to max rank (3)

  // Get effect for selected rank
  const getEffectForRank = (keepsake: Keepsake, rank: number): string => {
    switch (rank) {
      case 1: return keepsake.rank1Effect;
      case 2: return keepsake.rank2Effect;
      case 3: return keepsake.rank3Effect;
      case 4: return keepsake.heroicEffect || keepsake.rank3Effect;
      default: return keepsake.rank3Effect;
    }
  };

  const handleKeepsakeClick = (keepsake: Keepsake) => {
    // If clicking the same keepsake, deselect it
    if (selectedKeepsake?.keepsake.keepsakeId === keepsake.keepsakeId) {
      onSelectKeepsake(null);
    } else {
      // Select new keepsake with current rank
      onSelectKeepsake({ keepsake, rank: selectedRank });
    }
  };

  const handleRankChange = (rank: number) => {
    setSelectedRank(rank);
    // If there's already a selected keepsake, update its rank
    if (selectedKeepsake) {
      onSelectKeepsake({ keepsake: selectedKeepsake.keepsake, rank });
    }
  };

  const handleClose = () => {
    setHoveredKeepsake(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900 rounded-2xl border-4 border-blue-500/40 shadow-2xl max-w-7xl w-full max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-blue-500/30">
          <div className="flex items-center gap-4">
            <img src="/images/keepsakes/keepsakes_logo.webp" alt="Keepsakes" className="w-12 h-12 object-contain" />
            <h2 className="text-3xl font-bold text-blue-300">Keepsakes</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white text-2xl font-bold px-4 py-2 hover:bg-gray-800/50 rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Rank Selector */}
        <div className="p-6 border-b border-blue-500/20">
          <div className="flex items-center justify-center gap-3">
            <span className="text-sm text-gray-400 font-semibold">Rank:</span>
            {[1, 2, 3, 4].map(rank => (
              <button
                key={rank}
                onClick={() => handleRankChange(rank)}
                className={`px-4 py-1.5 rounded-lg border transition-all text-sm font-medium ${
                  selectedRank === rank
                    ? 'bg-purple-600/30 border-purple-400/60 text-purple-300'
                    : 'bg-gray-800/40 border-gray-600/40 text-gray-400 hover:bg-gray-700/40 hover:border-gray-500/50'
                }`}
                title={rank === 4 ? 'Heroic' : `Rank ${rank}`}
              >
                {rank === 4 ? '★ Heroic' : `Rank ${rank}`}
              </button>
            ))}
          </div>
        </div>

        {/* Content Grid + Details Panel */}
        <div className="flex-1 overflow-hidden flex">

          {/* Keepsake Grid */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-6 gap-4">
              {mockKeepsakes.map(keepsake => {
                const isSelected = selectedKeepsake?.keepsake.keepsakeId === keepsake.keepsakeId;
                const isHovered = hoveredKeepsake?.keepsakeId === keepsake.keepsakeId;

                return (
                  <button
                    key={keepsake.keepsakeId}
                    onClick={() => handleKeepsakeClick(keepsake)}
                    onMouseEnter={() => setHoveredKeepsake(keepsake)}
                    onMouseLeave={() => setHoveredKeepsake(null)}
                    className={`relative flex flex-col items-center p-3 rounded-lg border-2 transition-all ${
                      isSelected
                        ? 'bg-blue-600/30 border-blue-400 shadow-lg shadow-blue-500/50'
                        : isHovered
                        ? 'bg-gray-700/40 border-gray-500'
                        : 'bg-gray-800/30 border-gray-700/40 hover:bg-gray-700/30'
                    }`}
                    title={keepsake.name}
                  >
                    <ImageWithFallback
                      key={keepsake.iconUrl}
                      src={keepsake.iconUrl}
                      alt={keepsake.name}
                      className="w-16 h-16 rounded object-cover mb-2"
                      fallbackIcon="🎁"
                    />
                    <div className="text-xs text-white text-center truncate w-full font-medium">
                      {keepsake.name}
                    </div>
                    <div className="text-[10px] text-gray-400 text-center truncate w-full">
                      {keepsake.fromCharacter}
                    </div>

                    {/* Selected Indicator */}
                    {isSelected && (
                      <div className="absolute top-1 right-1 bg-blue-500 rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        ✓
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Details Panel */}
          <div className="w-96 border-l-2 border-blue-500/20 p-6 overflow-y-auto bg-gray-900/40">
            {(hoveredKeepsake || selectedKeepsake?.keepsake) ? (
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <ImageWithFallback
                    key={(hoveredKeepsake || selectedKeepsake?.keepsake)!.iconUrl}
                    src={(hoveredKeepsake || selectedKeepsake?.keepsake)!.iconUrl}
                    alt={(hoveredKeepsake || selectedKeepsake?.keepsake)!.name}
                    className="w-20 h-20 rounded object-cover"
                    fallbackIcon="🎁"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-blue-300 mb-1">
                      {(hoveredKeepsake || selectedKeepsake?.keepsake)!.name}
                    </h3>
                    <p className="text-sm text-gray-400">
                      From {(hoveredKeepsake || selectedKeepsake?.keepsake)!.fromCharacter}
                    </p>
                    <p className="text-xs text-purple-400 mt-1">
                      {(hoveredKeepsake || selectedKeepsake?.keepsake)!.category}
                    </p>
                  </div>
                </div>

                <div className="text-sm text-gray-300 leading-relaxed">
                  {(hoveredKeepsake || selectedKeepsake?.keepsake)!.description}
                </div>

                <div className="border-t border-blue-500/20 pt-4 space-y-3">
                  <div className="text-xs font-semibold text-blue-400 uppercase tracking-wide">
                    Effect at {selectedRank === 4 ? 'Heroic' : `Rank ${selectedRank}`}
                  </div>
                  <div className="text-sm text-green-400 font-medium">
                    {getEffectForRank((hoveredKeepsake || selectedKeepsake?.keepsake)!, selectedRank)}
                  </div>
                </div>

                {/* All Ranks Display */}
                <div className="border-t border-blue-500/20 pt-4 space-y-2">
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                    All Ranks
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex gap-2">
                      <span className={`font-medium w-16 ${selectedRank === 1 ? 'text-blue-400' : 'text-gray-500'}`}>Rank 1:</span>
                      <span className={`${selectedRank === 1 ? 'text-blue-300 font-bold' : 'text-gray-400'}`}>{(hoveredKeepsake || selectedKeepsake?.keepsake)!.rank1Effect}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className={`font-medium w-16 ${selectedRank === 2 ? 'text-blue-400' : 'text-gray-500'}`}>Rank 2:</span>
                      <span className={`${selectedRank === 2 ? 'text-blue-300 font-bold' : 'text-gray-400'}`}>{(hoveredKeepsake || selectedKeepsake?.keepsake)!.rank2Effect}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className={`font-medium w-16 ${selectedRank === 3 ? 'text-blue-400' : 'text-gray-500'}`}>Rank 3:</span>
                      <span className={`${selectedRank === 3 ? 'text-blue-300 font-bold' : 'text-gray-400'}`}>{(hoveredKeepsake || selectedKeepsake?.keepsake)!.rank3Effect}</span>
                    </div>
                    {(hoveredKeepsake || selectedKeepsake?.keepsake)!.heroicEffect && (
                      <div className="flex gap-2">
                        <span className={`font-medium w-16 ${selectedRank === 4 ? 'text-purple-400' : 'text-gray-500'}`}>Heroic:</span>
                        <span className={`${selectedRank === 4 ? 'text-purple-300 font-bold' : 'text-gray-400'}`}>{(hoveredKeepsake || selectedKeepsake?.keepsake)!.heroicEffect}</span>
                      </div>
                    )}
                  </div>
                </div>

                {(hoveredKeepsake || selectedKeepsake?.keepsake)!.bondMessage && (
                  <div className="border-t border-blue-500/20 pt-4">
                    <div className="text-xs italic text-blue-300/80 leading-relaxed">
                      "{(hoveredKeepsake || selectedKeepsake?.keepsake)!.bondMessage}"
                    </div>
                  </div>
                )}

                {(hoveredKeepsake || selectedKeepsake?.keepsake)!.notes && (
                  <div className="border-t border-blue-500/20 pt-4">
                    <div className="text-xs text-gray-500 leading-relaxed">
                      <span className="font-semibold">Note: </span>
                      {(hoveredKeepsake || selectedKeepsake?.keepsake)!.notes}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-600">
                <div className="text-center">
                  <div className="text-4xl mb-2">🎁</div>
                  <div>Hover or select a keepsake to see details</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t-2 border-blue-500/30">
          <div className="text-sm text-gray-400">
            {selectedKeepsake ? (
              <span className="text-blue-300 font-medium">
                Selected: {selectedKeepsake.keepsake.name} (Rank {selectedKeepsake.rank === 4 ? 'Heroic' : selectedKeepsake.rank})
              </span>
            ) : (
              'No keepsake selected'
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => onSelectKeepsake(null)}
              className="px-6 py-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg border border-gray-600/40 transition-colors text-sm font-medium"
              disabled={!selectedKeepsake}
            >
              Clear Selection
            </button>
            <button
              onClick={handleClose}
              className="px-6 py-2 bg-blue-600/40 hover:bg-blue-600/60 rounded-lg border border-blue-500/60 transition-colors text-sm font-medium"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeepsakeModal;
