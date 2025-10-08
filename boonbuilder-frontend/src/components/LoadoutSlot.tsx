import React from 'react';
import { X } from 'lucide-react';
import { BoonSlot, Boon, Weapon, WeaponAspect, Familiar, FamiliarAbility } from '../types';
import ImageWithFallback from './ImageWithFallback';
import RichText from './RichText';

interface LoadoutSlotProps {
  slotType: 'weapon' | 'familiar' | 'boon';
  slotName?: string;
  boonSlot?: BoonSlot;
  selectedItem?: Boon | Weapon | Familiar;
  selectedAspect?: WeaponAspect; // Only for weapon slots
  selectedFamiliarAbility?: FamiliarAbility; // Only for familiar slots
  onRemove?: () => void;
  emptyIcon: string; // Path to the empty slot template image
  emptyLabel: string;
  variant?: 'default' | 'large'; // NEW: allows larger slot for game-board
}

const LoadoutSlot: React.FC<LoadoutSlotProps> = ({
  slotType,
  slotName,
  selectedItem,
  selectedAspect,
  selectedFamiliarAbility,
  onRemove,
  emptyIcon,
  emptyLabel,
  variant = 'default' // NEW default
}) => {
  const isEmpty = !selectedItem;

  const getItemIcon = (): string => {
    if (!selectedItem) return emptyIcon;
    return selectedItem.iconUrl;
  };

  const getItemName = (): string => {
    if (!selectedItem) return emptyLabel;
    return selectedItem.name;
  };

  const getSubtext = (): string => {
    if (!selectedItem) return '';

    if (slotType === 'weapon' && selectedAspect) {
      return selectedAspect.name;
    }

    if (slotType === 'familiar' && selectedFamiliarAbility) {
      return selectedFamiliarAbility.name;
    }

    if (slotType === 'boon') {
      const boon = selectedItem as Boon;
      // Show god name for boons
      return boon.god?.name || '';
    }

    return selectedItem.description.substring(0, 40) + '...';
  };

  const getFullDescription = (): string | null => {
    if (!selectedItem || slotType === 'weapon') return null;

    // Show familiar ability description if available
    if (slotType === 'familiar' && selectedFamiliarAbility) {
      return selectedFamiliarAbility.description;
    }

    return selectedItem.description;
  };

  // Size classes depending on variant
  const containerSizeClass = variant === 'large' ? 'w-16 h-16' : 'w-14 h-14';
  const imgSizeClass = variant === 'large' ? 'w-12 h-12' : 'w-10 h-10';

  return (
    <div className={`
      relative flex items-center p-3 rounded-lg transition-all duration-300
      ${isEmpty
        ? 'bg-gray-800/30 border border-gray-600/50'
        : 'bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-500/60'
      }
      hover:border-purple-400/80 group
    `}>
      {/* Slot Icon Container - Game-style rounded square */}
      <div className={`
        relative ${containerSizeClass} rounded-lg flex items-center justify-center mr-3
        ${isEmpty
          ? 'bg-gray-700/50 border-2 border-gray-600/70'
          : 'bg-gradient-to-br from-purple-600/20 to-blue-600/20 border-2 border-purple-400/60'
        }
        shadow-lg transition-all duration-300 group-hover:scale-105
      `}>
        <ImageWithFallback
          src={getItemIcon()}
          alt={getItemName()}
          className={`
            ${imgSizeClass} rounded object-cover transition-all duration-300
            ${isEmpty ? 'opacity-60 grayscale' : 'opacity-100'}
          `}
          fallbackIcon={emptyLabel.charAt(0)}
        />

        {/* Glow effect for filled slots */}
        {!isEmpty && (
          <div className="absolute inset-0 bg-purple-400/12 rounded-lg animate-pulse opacity-60"></div>
        )}
      </div>

      {/* Slot Content */}
      <div className="flex-1">
        <div className="text-sm text-gray-400 capitalize mb-1">
          {slotName || slotType}
        </div>
        <div className={`font-medium transition-colors ${isEmpty ? 'text-gray-500' : 'text-white'}`}>
          {getItemName()}
        </div>
        {getSubtext() && (
          <div className="text-xs text-purple-300 mt-1">
            {getSubtext()}
          </div>
        )}
        {getFullDescription() && (
          <RichText
            text={getFullDescription()!}
            className="text-xs text-gray-300 mt-1.5 italic"
          />
        )}
      </div>

      {/* Remove Button */}
      {!isEmpty && onRemove && (
        <button
          onClick={onRemove}
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200
            text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-900/30"
          title={`Remove ${getItemName()}`}
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default LoadoutSlot;