/**
 * RadialItemCard Component
 *
 * Individual card component for radial menu items
 * Supports two variants:
 * - Single Icon: For slots, categories, and single boons
 * - Dual Icon: For gods showing their boon for a specific slot
 */

import React from 'react';
import { motion } from 'framer-motion';
import ImageWithFallback from './ImageWithFallback';
import { getGodColor } from '../utils/radialUtils';

export interface RadialItem {
  id: string;
  type: 'slot' | 'god' | 'boon' | 'category';
  primaryIcon: string;
  primaryLabel: string;
  secondaryIcon?: string;    // For dual-icon variant (boon icon on god card)
  secondaryLabel?: string;   // For dual-icon variant (boon name on god card)
  color?: string;            // God-specific color
  godName?: string;          // For god color theming
  isLocked?: boolean;
  isSelected?: boolean;
  tooltipText?: string;      // For locked items prerequisite info
}

interface RadialItemCardProps {
  item: RadialItem;
  index: number;
  isHovered: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const RadialItemCard: React.FC<RadialItemCardProps> = ({
  item,
  index,
  isHovered,
  onClick,
  onMouseEnter,
  onMouseLeave
}) => {
  // Determine variant
  const isDualIcon = !!(item.secondaryIcon && item.secondaryLabel);

  // Get theme color
  const themeColor = item.godName ? getGodColor(item.godName) : (item.color || '#a855f7');

  // Border color based on state
  const getBorderColor = () => {
    if (item.isSelected) return 'border-green-400';
    if (item.isLocked) return 'border-gray-600';
    if (isHovered) return 'border-yellow-400';
    return 'border-purple-400/40';
  };

  // Shadow/glow effect
  const getShadowClass = () => {
    if (item.isSelected) return 'shadow-lg shadow-green-400/50';
    if (isHovered) return 'shadow-xl shadow-yellow-400/50';
    if (item.godName && !item.isLocked) {
      return `shadow-md`; // God-specific glow handled via style
    }
    return 'shadow-md shadow-purple-500/30';
  };

  // Opacity for locked state
  const opacityClass = item.isLocked ? 'opacity-60' : 'opacity-100';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: item.isLocked ? 0.6 : 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{
        duration: 0.05,
        ease: 'easeOut'
      }}
      whileHover={{ scale: item.isLocked ? 1 : 1.15, transition: { duration: 0.1 } }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`
        ${item.isLocked ? 'cursor-not-allowed' : 'cursor-pointer'}
        ${opacityClass}
        transition-all duration-75
      `}
      title={item.tooltipText}
      style={{
        boxShadow: isHovered && item.godName && !item.isLocked
          ? `0 0 20px ${themeColor}80`
          : undefined
      }}
    >
      {isDualIcon ? (
        // DUAL ICON VARIANT (God with Boon)
        <div
          className={`
            relative flex flex-col items-center justify-center
            w-40 h-48 rounded-xl border-3
            bg-gray-800/60 backdrop-blur-md
            ${getBorderColor()} ${getShadowClass()}
            transition-all duration-75
            p-3
          `}
          style={{
            borderColor: isHovered && !item.isLocked ? themeColor : undefined
          }}
        >
          {/* God Icon */}
          <ImageWithFallback
            key={item.primaryIcon}
            src={item.primaryIcon}
            alt={item.primaryLabel}
            className="w-20 h-20 rounded-lg mb-2"
            fallbackIcon="👤"
          />

          {/* God Name */}
          <div className="text-base font-bold text-white text-center w-full px-1 leading-tight">
            {item.primaryLabel}
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-purple-500/30 my-2" />

          {/* Boon Info */}
          <div className="flex items-center gap-2 w-full px-1">
            <ImageWithFallback
              key={item.secondaryIcon}
              src={item.secondaryIcon!}
              alt={item.secondaryLabel!}
              className="w-8 h-8 rounded flex-shrink-0"
              fallbackIcon="✨"
            />
            <div className="text-xs text-gray-300 flex-1 leading-tight overflow-hidden">
              <div className="line-clamp-2">
                {item.secondaryLabel}
              </div>
            </div>
          </div>

          {/* Selected Badge */}
          {item.isSelected && (
            <div className="absolute -top-2 -right-2 bg-green-500 rounded-full w-8 h-8 flex items-center justify-center text-sm border-2 border-gray-900">
              ✓
            </div>
          )}

          {/* Locked Badge */}
          {item.isLocked && (
            <div className="absolute -top-2 -right-2 bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center text-sm border-2 border-gray-900">
              🔒
            </div>
          )}
        </div>
      ) : (
        // SINGLE ICON VARIANT (Slots, Categories, Boons)
        <div
          className={`
            relative flex flex-col items-center justify-center
            w-28 h-28 rounded-xl border-3
            bg-gray-800/60 backdrop-blur-md
            ${getBorderColor()} ${getShadowClass()}
            transition-all duration-75
            p-2
          `}
          style={{
            borderColor: isHovered && !item.isLocked ? themeColor : undefined
          }}
        >
          {/* Icon */}
          <ImageWithFallback
            key={item.primaryIcon}
            src={item.primaryIcon}
            alt={item.primaryLabel}
            className="w-16 h-16 rounded-lg mb-1"
            fallbackIcon={item.type === 'slot' ? '⚔️' : item.type === 'category' ? '📁' : '✨'}
          />

          {/* Label */}
          <div className="text-xs font-semibold text-white text-center w-full leading-tight px-1">
            <div className="line-clamp-2">
              {item.primaryLabel}
            </div>
          </div>

          {/* Selected Badge */}
          {item.isSelected && (
            <div className="absolute -top-2 -right-2 bg-green-500 rounded-full w-7 h-7 flex items-center justify-center text-sm border-2 border-gray-900">
              ✓
            </div>
          )}

          {/* Locked Badge */}
          {item.isLocked && (
            <div className="absolute -top-2 -right-2 bg-gray-700 rounded-full w-7 h-7 flex items-center justify-center text-sm border-2 border-gray-900">
              🔒
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default RadialItemCard;
