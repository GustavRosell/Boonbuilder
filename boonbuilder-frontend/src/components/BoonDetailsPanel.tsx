/**
 * BoonDetailsPanel - Hover-based Boon Information Display
 *
 * Shows detailed information about a boon when hovering:
 * - Name and icon
 * - Description and effects
 * - God/source information
 * - Prerequisites (for duo/legendary)
 * - Rarity scaling
 * - Element and status effects
 */

import React from 'react';
import { Boon, AvailableBoon, BoonType } from '../types';
import ImageWithFallback from './ImageWithFallback';
import { Sparkles, Lock, X } from 'lucide-react';

interface BoonDetailsPanelProps {
  boon: Boon | AvailableBoon | null;
  isAvailable?: boolean;
  isPinned?: boolean;
  onClearPin?: () => void;
}

const getBoonTypeLabel = (type: BoonType | string): string => {
  const typeNum = typeof type === 'string' ? parseInt(type) : type;
  const labels: Record<number, string> = {
    0: 'Core',
    1: 'Duo',
    2: 'Legendary',
    3: 'Infusion',
    4: 'Hex',
    5: 'Chaos',
    6: 'Godsent'
  };
  return labels[typeNum] || 'Unknown';
};

const getBoonTypeColor = (type: BoonType | string): string => {
  const typeNum = typeof type === 'string' ? parseInt(type) : type;
  const colors: Record<number, string> = {
    0: 'text-purple-400',
    1: 'text-yellow-400',
    2: 'text-orange-400',
    3: 'text-blue-400',
    4: 'text-indigo-400',
    5: 'text-pink-400',
    6: 'text-green-400'
  };
  return colors[typeNum] || 'text-gray-400';
};

const BoonDetailsPanel: React.FC<BoonDetailsPanelProps> = ({ boon, isAvailable = true, isPinned = false, onClearPin }) => {
  if (!boon) {
    return (
      <div className="bg-gray-800/40 rounded-lg p-6 border border-gray-700/50 h-full flex flex-col items-center justify-center">
        <div className="text-gray-600 text-center">
          <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Hover or click a boon to see details</p>
        </div>
      </div>
    );
  }

  const typeLabel = getBoonTypeLabel(boon.type);
  const typeColor = getBoonTypeColor(boon.type);

  return (
    <div className="bg-gray-800/40 rounded-lg border border-gray-700/50 h-full flex flex-col">

      {/* Scrollable Content */}
      <div className="flex-1 overflow-auto p-4">

        {/* Header: Icon + Name + Type */}
        <div className="flex items-start gap-4 mb-4 pb-4 border-b border-gray-700/50">
        <div className="w-16 h-16 rounded-lg bg-gray-700/50 border border-gray-600/50 flex items-center justify-center flex-shrink-0">
          <ImageWithFallback
            src={boon.iconUrl}
            alt={boon.name}
            className="w-14 h-14 object-cover rounded"
            fallbackIcon="✨"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-white truncate">{boon.name}</h3>
            {!isAvailable && (
              <Lock className="w-4 h-4 text-red-400 flex-shrink-0" />
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-semibold ${typeColor}`}>{typeLabel}</span>
            {boon.god && (
              <>
                <span className="text-gray-600">•</span>
                <span className="text-xs text-gray-400">{boon.god.name}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Availability Status */}
      {!isAvailable && (
        <div className="mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
          <div className="flex items-center gap-2 text-red-400 text-sm">
            <Lock className="w-4 h-4 flex-shrink-0" />
            <span className="font-semibold">Prerequisites not met</span>
          </div>
        </div>
      )}

      {/* Description */}
      <div className="mb-4">
        <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Description</h4>
        <p className="text-sm text-gray-300 leading-relaxed">{boon.description}</p>
      </div>

      {/* Effect */}
      <div className="mb-4">
        <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Effect</h4>
        <p className="text-sm text-purple-300 font-medium">{boon.effect}</p>
      </div>

      {/* Status Effect */}
      {'statusEffect' in boon && boon.statusEffect && (
        <div className="mb-4">
          <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Status Effect</h4>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-900/20 border border-orange-500/30 rounded-full">
            <div className="w-2 h-2 rounded-full bg-orange-400"></div>
            <span className="text-sm text-orange-300 font-semibold">{boon.statusEffect}</span>
          </div>
        </div>
      )}

      {/* Element */}
      {'element' in boon && boon.element !== undefined && boon.element !== null && (
        <div className="mb-4">
          <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Element</h4>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-900/20 border border-blue-500/30 rounded-full">
            <span className="text-sm text-blue-300 font-semibold">
              {['Fire', 'Water', 'Earth', 'Air', 'Aether'][boon.element]}
            </span>
          </div>
        </div>
      )}

      {/* Duo Boon Gods (if applicable) */}
      {'firstGod' in boon && 'secondGod' in boon && boon.firstGod && boon.secondGod && (
        <div className="mb-4">
          <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Collaboration</h4>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1 bg-purple-900/20 border border-purple-500/30 rounded-full">
              <ImageWithFallback
                src={boon.firstGod.iconUrl}
                alt={boon.firstGod.name}
                className="w-4 h-4 rounded-full"
                fallbackIcon="👤"
              />
              <span className="text-xs text-purple-300">{boon.firstGod.name}</span>
            </div>
            <span className="text-gray-600">+</span>
            <div className="flex items-center gap-2 px-3 py-1 bg-purple-900/20 border border-purple-500/30 rounded-full">
              <ImageWithFallback
                src={boon.secondGod.iconUrl}
                alt={boon.secondGod.name}
                className="w-4 h-4 rounded-full"
                fallbackIcon="👤"
              />
              <span className="text-xs text-purple-300">{boon.secondGod.name}</span>
            </div>
          </div>
        </div>
      )}

        {/* Passive Indicator */}
        {'isPassive' in boon && boon.isPassive && (
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-900/20 border border-green-500/30 rounded-full">
            <span className="text-xs text-green-300 font-semibold">Passive Effect</span>
          </div>
        )}

      </div>

      {/* Clear Selection Button - Always at Bottom */}
      {isPinned && onClearPin && (
        <div className="p-4 pt-3 border-t border-gray-700/50 flex justify-center">
          <button
            onClick={onClearPin}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50
              rounded-lg transition-colors text-gray-300 hover:text-white text-sm font-medium"
          >
            <X className="w-4 h-4" />
            Clear Selection
          </button>
        </div>
      )}

    </div>
  );
};

export default BoonDetailsPanel;
