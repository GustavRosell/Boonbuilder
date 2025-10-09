/**
 * AvailableSpecialBoonsIndicator - Visual indicator for eligible duo/legendary boons
 *
 * Shows when duo or legendary boons have their prerequisites met.
 * Displays a glowing/pulsing notification to attract attention.
 * Click to expand and see available boons.
 */

import React, { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { AvailableBoon } from '../types';
import ImageWithFallback from './ImageWithFallback';

interface AvailableSpecialBoonsIndicatorProps {
  availableDuoBoons: AvailableBoon[];
  availableLegendaryBoons: AvailableBoon[];
  selectedDuoBoons: AvailableBoon[];
  selectedLegendaryBoons: AvailableBoon[];
  onSelectDuoBoon: (boon: AvailableBoon) => void;
  onSelectLegendaryBoon: (boon: AvailableBoon) => void;
}

const AvailableSpecialBoonsIndicator: React.FC<AvailableSpecialBoonsIndicatorProps> = ({
  availableDuoBoons,
  availableLegendaryBoons,
  selectedDuoBoons,
  selectedLegendaryBoons,
  onSelectDuoBoon,
  onSelectLegendaryBoon
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Filter to only show available (unlocked) boons that aren't already selected
  const eligibleDuo = availableDuoBoons.filter(
    b => b.isAvailable && !selectedDuoBoons.some(s => s.boonId === b.boonId)
  );
  const eligibleLegendary = availableLegendaryBoons.filter(
    b => b.isAvailable && !selectedLegendaryBoons.some(s => s.boonId === b.boonId)
  );

  const totalEligible = eligibleDuo.length + eligibleLegendary.length;

  // If no eligible boons, don't show anything
  if (totalEligible === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-yellow-900/20 via-orange-900/20 to-purple-900/20 rounded-lg border-2 border-yellow-500/40 overflow-hidden animate-pulse-slow">

      {/* Header - Always Visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-3 flex items-center justify-between hover:bg-yellow-900/10 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
          <div>
            <div className="text-sm font-bold text-yellow-300">
              {totalEligible} Special Boon{totalEligible !== 1 ? 's' : ''} Available!
            </div>
            <div className="text-xs text-gray-400">
              {eligibleDuo.length > 0 && `${eligibleDuo.length} Duo`}
              {eligibleDuo.length > 0 && eligibleLegendary.length > 0 && ' • '}
              {eligibleLegendary.length > 0 && `${eligibleLegendary.length} Legendary`}
            </div>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-3 pt-0 space-y-3 border-t border-yellow-500/20">

          {/* Duo Boons */}
          {eligibleDuo.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-yellow-300 mb-2 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
                Duo Boons Available
              </div>
              <div className="grid grid-cols-2 gap-2">
                {eligibleDuo.map(boon => (
                  <button
                    key={boon.boonId}
                    onClick={() => onSelectDuoBoon(boon)}
                    className="flex items-center gap-2 p-2 rounded-lg bg-yellow-900/20 border border-yellow-500/40
                      hover:bg-yellow-900/30 hover:border-yellow-500/60 hover:shadow-lg hover:shadow-yellow-500/20
                      transition-all group"
                    title={`${boon.name}\n${boon.description}`}
                  >
                    <div className="w-8 h-8 rounded bg-yellow-900/30 border border-yellow-500/50 flex items-center justify-center flex-shrink-0
                      group-hover:scale-110 transition-transform">
                      <ImageWithFallback
                        src={boon.iconUrl}
                        alt={boon.name}
                        className="w-7 h-7 rounded object-cover"
                        fallbackIcon="🤝"
                      />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <div className="text-xs font-semibold text-white truncate">{boon.name}</div>
                      <div className="text-[10px] text-gray-400 truncate">{boon.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Legendary Boons */}
          {eligibleLegendary.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-orange-300 mb-2 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></span>
                Legendary Boons Available
              </div>
              <div className="grid grid-cols-2 gap-2">
                {eligibleLegendary.map(boon => (
                  <button
                    key={boon.boonId}
                    onClick={() => onSelectLegendaryBoon(boon)}
                    className="flex items-center gap-2 p-2 rounded-lg bg-orange-900/20 border border-orange-500/40
                      hover:bg-orange-900/30 hover:border-orange-500/60 hover:shadow-lg hover:shadow-orange-500/20
                      transition-all group"
                    title={`${boon.name}\n${boon.description}`}
                  >
                    <div className="w-8 h-8 rounded bg-orange-900/30 border border-orange-500/50 flex items-center justify-center flex-shrink-0
                      group-hover:scale-110 transition-transform">
                      <ImageWithFallback
                        src={boon.iconUrl}
                        alt={boon.name}
                        className="w-7 h-7 rounded object-cover"
                        fallbackIcon="⭐"
                      />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <div className="text-xs font-semibold text-white truncate">{boon.name}</div>
                      <div className="text-[10px] text-gray-400 truncate">{boon.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default AvailableSpecialBoonsIndicator;
