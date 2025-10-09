/**
 * ArcanaCardModal Component
 *
 * Modal for selecting multiple Arcana Cards with Grasp system
 * Features:
 * - 5x5 grid layout matching in-game
 * - Grasp counter (current/max) with adjustable max (10-30)
 * - Multiple selection with Grasp cost enforcement
 * - Rank selector (1-4) - defaults to max rank
 * - Visual states: active, inactive, insufficient Grasp, locked (awakening)
 * - 0-cost cards auto-unlock when awakening requirements are met
 * - Grasp cost badges on each card
 * - Warning when closing modal if over Grasp limit
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  ArcanaCard,
  mockArcanaCards,
  calculateTotalGrasp,
  canAddCard,
  getCardEffect,
  DEFAULT_MAX_GRASP,
  MAXIMUM_MAX_GRASP
} from '../data/mockArcanaCards';
import ImageWithFallback from './ImageWithFallback';
import RichText from './RichText';
import {
  updateAwakenedCards,
  isAwakeningCard,
  getAwakeningStatus
} from '../utils/arcanaAwakening';

interface ArcanaCardSelection {
  card: ArcanaCard;
  rank: number; // 1-4
}

interface ArcanaCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCards: ArcanaCardSelection[];
  onSelectCards: (selections: ArcanaCardSelection[]) => void;
  maxGrasp: number;
  onMaxGraspChange: (maxGrasp: number) => void;
}

const ArcanaCardModal: React.FC<ArcanaCardModalProps> = ({
  isOpen,
  onClose,
  selectedCards,
  onSelectCards,
  maxGrasp,
  onMaxGraspChange
}) => {
  const [hoveredCard, setHoveredCard] = useState<ArcanaCard | null>(null);
  const [selectedRank, setSelectedRank] = useState<number>(4); // Default to max rank (4)
  const [showGraspAdjuster, setShowGraspAdjuster] = useState(false);
  const [tempMaxGrasp, setTempMaxGrasp] = useState(maxGrasp);

  // Calculate current Grasp usage
  const currentGrasp = useMemo(() => {
    return calculateTotalGrasp(selectedCards.map(s => s.card));
  }, [selectedCards]);

  const isOverLimit = currentGrasp > maxGrasp;

  // Auto-update awakened cards when selections change
  useEffect(() => {
    const updatedSelections = updateAwakenedCards(mockArcanaCards, selectedCards);

    // Only update if there's an actual change to prevent infinite loops
    if (JSON.stringify(updatedSelections) !== JSON.stringify(selectedCards)) {
      onSelectCards(updatedSelections);
    }
  }, [selectedCards, onSelectCards]);

  // Check if a card is selected
  const isCardSelected = (cardId: number): boolean => {
    return selectedCards.some(s => s.card.cardId === cardId);
  };

  // Get selected card's rank
  const getSelectedCardRank = (cardId: number): number | undefined => {
    return selectedCards.find(s => s.card.cardId === cardId)?.rank;
  };

  const handleCardClick = (card: ArcanaCard) => {
    // 0-cost awakening cards are system-controlled, not clickable
    if (isAwakeningCard(card)) {
      return;
    }

    const alreadySelected = isCardSelected(card.cardId);

    if (alreadySelected) {
      // Deselect card
      onSelectCards(selectedCards.filter(s => s.card.cardId !== card.cardId));
    } else {
      // Try to select card
      if (canAddCard(card, selectedCards.map(s => s.card), maxGrasp)) {
        onSelectCards([...selectedCards, { card, rank: selectedRank }]);
      } else {
        // Show visual feedback that card cannot be added (Grasp limit exceeded)
        // Could add a toast notification here
        console.log('Cannot add card: Grasp limit exceeded');
      }
    }
  };

  const handleRankChange = (rank: number) => {
    setSelectedRank(rank);
    // Update all selected cards to new rank
    onSelectCards(selectedCards.map(s => ({ card: s.card, rank })));
  };

  const handleMaxGraspConfirm = () => {
    onMaxGraspChange(tempMaxGrasp);
    setShowGraspAdjuster(false);
  };

  const handleClose = () => {
    // Warn if over Grasp limit
    if (isOverLimit) {
      const confirmed = window.confirm(
        `Warning: Your selected cards use ${currentGrasp} Grasp, but your limit is ${maxGrasp}. ` +
        `You will not be able to save this build until you reduce your Grasp usage or increase your limit.\n\n` +
        `Continue anyway?`
      );
      if (!confirmed) return;
    }

    setHoveredCard(null);
    onClose();
  };

  const handleClearAll = () => {
    const confirmed = window.confirm('Are you sure you want to deselect all Arcana Cards?');
    if (confirmed) {
      onSelectCards([]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 rounded-2xl border-4 border-purple-500/40 shadow-2xl max-w-7xl w-full max-h-[95vh] flex flex-col">

        {/* Compact Header */}
        <div className="relative p-4 border-b-2 border-purple-500/30">
          <div className="grid grid-cols-[60%_40%] gap-6 items-center">
            {/* Left: Logo + Title */}
            <div className="flex items-center gap-4">
              <img src="/images/Arcana_Cards/Arcana_Cards_Logo.webp" alt="Arcana Cards" className="w-12 h-12 object-contain" />
              <h2 className="text-3xl font-bold text-purple-300">Arcana Cards</h2>
            </div>

            {/* Right: Grasp + Rank (stacked) */}
            <div className="space-y-2">
              {/* Row 1: Grasp Counter + Adjust Button */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className={`text-lg font-bold ${isOverLimit ? 'text-red-400' : currentGrasp === maxGrasp ? 'text-yellow-400' : 'text-purple-300'}`}>
                    <span className={isOverLimit ? 'text-red-500' : ''}>{currentGrasp}</span>
                    <span className="text-gray-500"> / </span>
                    <span>{maxGrasp}</span>
                    <span className="text-sm text-gray-400 ml-1">Grasp</span>
                  </div>
                  {isOverLimit && (
                    <span className="text-xs text-red-400 font-semibold bg-red-900/30 px-2 py-0.5 rounded border border-red-500/50">
                      ⚠ Over
                    </span>
                  )}
                </div>
                <button
                  onClick={() => {
                    setTempMaxGrasp(maxGrasp);
                    setShowGraspAdjuster(true);
                  }}
                  className="px-3 py-1 bg-purple-600/20 hover:bg-purple-600/30 rounded-lg border border-purple-500/40 transition-colors text-xs font-medium whitespace-nowrap"
                >
                  Adjust Max
                </button>
              </div>

              {/* Row 2: Rank Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-semibold">Rank:</span>
                {[1, 2, 3, 4].map(rank => (
                  <button
                    key={rank}
                    onClick={() => handleRankChange(rank)}
                    className={`px-3 py-1 rounded-lg border transition-all text-xs font-medium ${
                      selectedRank === rank
                        ? 'bg-purple-600/30 border-purple-400/60 text-purple-300'
                        : 'bg-gray-800/40 border-gray-600/40 text-gray-400 hover:bg-gray-700/40 hover:border-gray-500/50'
                    }`}
                  >
                    {rank}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Max Grasp Adjuster - Collapsible Overlay */}
          {showGraspAdjuster && (
            <div className="mt-3 bg-gray-800/60 border border-purple-500/30 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-300">Max Grasp: {tempMaxGrasp}</span>
                <div className="flex gap-2">
                  <button
                    onClick={handleMaxGraspConfirm}
                    className="px-2 py-0.5 bg-purple-600/40 hover:bg-purple-600/60 rounded border border-purple-500/60 text-xs font-medium transition-colors"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setShowGraspAdjuster(false)}
                    className="px-2 py-0.5 bg-gray-700/40 hover:bg-gray-600/40 rounded border border-gray-600/40 text-xs font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
              <input
                type="range"
                min={DEFAULT_MAX_GRASP}
                max={MAXIMUM_MAX_GRASP}
                value={tempMaxGrasp}
                onChange={(e) => setTempMaxGrasp(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Min: {DEFAULT_MAX_GRASP}</span>
                <span>Max: {MAXIMUM_MAX_GRASP}</span>
              </div>
            </div>
          )}
        </div>

        {/* Content Grid + Details Panel */}
        <div className="flex-1 overflow-hidden flex">

          {/* 5x5 Arcana Card Grid */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-5 gap-3 max-w-4xl mx-auto">
              {mockArcanaCards.map(card => {
                const isSelected = isCardSelected(card.cardId);
                const isHovered = hoveredCard?.cardId === card.cardId;
                const awakeningStatus = getAwakeningStatus(card, mockArcanaCards, selectedCards);
                const isLocked = awakeningStatus.isAwakening && !awakeningStatus.isAwakened;
                const canAfford = canAddCard(card, selectedCards.map(s => s.card), maxGrasp) || isSelected;

                return (
                  <button
                    key={card.cardId}
                    onClick={() => handleCardClick(card)}
                    onMouseEnter={() => setHoveredCard(card)}
                    onMouseLeave={() => setHoveredCard(null)}
                    disabled={!isSelected && !canAfford}
                    className={`relative flex flex-col items-center p-3 rounded-lg border-2 transition-all ${
                      isLocked
                        ? 'bg-gray-900/60 border-gray-800/60 opacity-40 cursor-not-allowed'
                        : isSelected
                        ? 'bg-purple-600/40 border-purple-400 shadow-lg shadow-purple-500/50'
                        : !canAfford
                        ? 'bg-gray-800/30 border-gray-700/40 opacity-50 cursor-not-allowed'
                        : isHovered
                        ? 'bg-gray-700/40 border-gray-500'
                        : 'bg-gray-800/30 border-gray-700/40 hover:bg-gray-700/30'
                    }`}
                    title={card.name}
                  >
                    {/* Card Image */}
                    <ImageWithFallback
                      key={card.iconUrl}
                      src={card.iconUrl}
                      alt={card.name}
                      className="w-24 h-32 rounded object-cover mb-2"
                      fallbackIcon="🃏"
                    />

                    {/* Roman Numeral */}
                    <div className="text-sm font-bold text-purple-300 mb-1">
                      {card.romanNumeral}
                    </div>

                    {/* Card Name */}
                    <div className="text-[10px] text-white text-center line-clamp-2 w-full">
                      {card.name}
                    </div>

                    {/* Grasp Cost Badge */}
                    <div className={`absolute top-2 left-2 rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold border-2 ${
                      card.graspCost === 0
                        ? 'bg-yellow-600/80 border-yellow-400 text-yellow-100'
                        : 'bg-purple-700/80 border-purple-400 text-purple-100'
                    }`}>
                      {card.graspCost}
                    </div>

                    {/* Selected Indicator */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 bg-purple-500 rounded-full w-6 h-6 flex items-center justify-center text-xs">
                        ✓
                      </div>
                    )}

                    {/* Locked Indicator (Awakening) */}
                    {isLocked && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-lg">
                        <div className="text-3xl">🔒</div>
                      </div>
                    )}

                    {/* Cannot Afford Overlay */}
                    {!isSelected && !canAfford && !isLocked && (
                      <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center">
                        <div className="text-xs text-red-400 font-semibold bg-black/60 px-2 py-1 rounded">
                          Insufficient Grasp
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Details Panel */}
          <div className="w-96 border-l-2 border-purple-500/20 p-6 overflow-y-auto bg-gray-900/40">
            {(hoveredCard || (selectedCards.length > 0 && selectedCards[selectedCards.length - 1]?.card)) ? (
              <div className="space-y-4">
                {(() => {
                  const displayCard = hoveredCard || selectedCards[selectedCards.length - 1].card;
                  const displayRank = getSelectedCardRank(displayCard.cardId) || selectedRank;
                  const awakeningStatus = getAwakeningStatus(displayCard, mockArcanaCards, selectedCards);
                  const isLocked = awakeningStatus.isAwakening && !awakeningStatus.isAwakened;

                  return (
                    <>
                      <div className="flex items-start gap-4">
                        <ImageWithFallback
                          key={displayCard.iconUrl}
                          src={displayCard.iconUrl}
                          alt={displayCard.name}
                          className="w-20 h-28 rounded object-cover"
                          fallbackIcon="🃏"
                        />
                        <div className="flex-1">
                          <div className="text-sm font-bold text-purple-400 mb-1">
                            {displayCard.romanNumeral}
                          </div>
                          <h3 className="text-xl font-bold text-purple-300 mb-2">
                            {displayCard.name}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-bold px-2 py-1 rounded ${
                              displayCard.graspCost === 0
                                ? 'bg-yellow-600/40 text-yellow-200 border border-yellow-500/50'
                                : 'bg-purple-600/40 text-purple-200 border border-purple-500/50'
                            }`}>
                              {displayCard.graspCost} Grasp
                            </span>
                            {isLocked && (
                              <span className="text-xs font-bold px-2 py-1 rounded bg-gray-700/60 text-gray-300 border border-gray-600/50">
                                🔒 Locked
                              </span>
                            )}
                            {awakeningStatus.isAwakened && (
                              <span className="text-xs font-bold px-2 py-1 rounded bg-green-600/40 text-green-200 border border-green-500/50">
                                ✓ Awakened
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="text-sm text-gray-300 leading-relaxed">
                        <RichText text={displayCard.description} />
                      </div>

                      {/* Awakening Requirement */}
                      {displayCard.awakeningRequirement && (
                        <div className="bg-yellow-900/20 border border-yellow-600/40 rounded-lg p-3">
                          <div className="text-xs font-semibold text-yellow-400 mb-1">
                            Awakening Requirement
                          </div>
                          <div className="text-xs text-yellow-200/80">
                            <RichText text={displayCard.awakeningRequirement} />
                          </div>
                        </div>
                      )}

                      {/* All Ranks Display */}
                      <div className="border-t border-purple-500/20 pt-4 space-y-2">
                        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                          All Ranks
                        </div>
                        <div className="space-y-2 text-xs">
                          {[1, 2, 3, 4].map(rank => (
                            <div key={rank} className="flex gap-2">
                              <span className={`font-medium w-16 ${
                                rank === displayRank ? 'text-green-400' : 'text-gray-500'
                              }`}>
                                Rank {rank}:
                              </span>
                              <span className={rank === displayRank ? 'text-green-300 font-bold' : 'text-gray-400'}>
                                <RichText text={getCardEffect(displayCard, rank)} />
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Quote */}
                      <div className="border-t border-purple-500/20 pt-4">
                        <div className="text-xs italic text-purple-300/80 leading-relaxed">
                          "{displayCard.quote}"
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-600">
                <div className="text-center space-y-3 px-6">
                  <div className="text-4xl mb-2">🃏</div>
                  <div className="text-sm">Hover or select a card to see details</div>
                  <div className="text-xs text-gray-500 leading-relaxed">
                    <span className="text-yellow-400 font-semibold">0-cost cards</span> are automatically activated when you meet their awakening requirements.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t-2 border-purple-500/30">
          <div className="text-sm text-gray-400">
            <span className="text-purple-300 font-medium">
              {selectedCards.length} card{selectedCards.length !== 1 ? 's' : ''} selected
            </span>
            {isOverLimit && (
              <span className="text-red-400 font-semibold ml-3">
                ⚠ Cannot save build while over Grasp limit!
              </span>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleClearAll}
              className="px-6 py-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg border border-gray-600/40 transition-colors text-sm font-medium"
              disabled={selectedCards.length === 0}
            >
              Clear All
            </button>
            <button
              onClick={handleClose}
              className={`px-6 py-2 rounded-lg border transition-colors text-sm font-medium ${
                isOverLimit
                  ? 'bg-red-600/40 hover:bg-red-600/60 border-red-500/60'
                  : 'bg-purple-600/40 hover:bg-purple-600/60 border-purple-500/60'
              }`}
            >
              {isOverLimit ? 'Close (Over Limit)' : 'Confirm'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArcanaCardModal;
