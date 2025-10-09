/**
 * RadialCenterDisplay Component
 *
 * Shows information in the center of the radial menu:
 * - Hovered item icon and name
 * - Navigation state indicator when nothing hovered
 * - Back button for navigation (when not at root level)
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import ImageWithFallback from './ImageWithFallback';
import { RadialItem } from './RadialItemCard';
import { BoonSlot } from '../types';

interface NavigationState {
  tab: 'core' | 'non-core' | 'special';
  level: 1 | 2 | 3;
  selectedSlot?: BoonSlot;
  selectedCategory?: string;
  selectedGodName?: string;
}

interface RadialCenterDisplayProps {
  hoveredItem: RadialItem | null;
  navigationState: NavigationState;
  onBack: () => void;
}

const RadialCenterDisplay: React.FC<RadialCenterDisplayProps> = ({
  hoveredItem,
  navigationState,
  onBack
}) => {
  const showBackButton = navigationState.level > 1;

  // Get state indicator text based on current navigation
  const getStateText = (): string => {
    const { tab, level, selectedSlot, selectedCategory, selectedGodName } = navigationState;

    if (tab === 'core') {
      if (level === 1) return 'Select a Slot';
      if (level === 2) return `Select God for ${selectedSlot ? BoonSlot[selectedSlot] : 'Slot'}`;
      if (level === 3) return `Select ${selectedGodName} Boon`;
    }

    if (tab === 'non-core') {
      if (level === 1) return 'Select Category';
      if (level === 2) return `Select God from ${selectedCategory}`;
      if (level === 3) return `Select ${selectedGodName} Boon`;
    }

    if (tab === 'special') {
      return 'Select Special Boon';
    }

    return 'Select an Item';
  };

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
      <AnimatePresence mode="wait">
        {showBackButton ? (
          // BACK BUTTON
          <motion.button
            key="back-button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.05 }}
            onClick={onBack}
            className="
              w-40 h-40 rounded-full
              bg-gradient-to-br from-gray-800 to-gray-900
              border-4 border-purple-400
              flex items-center justify-center
              hover:scale-110 hover:border-yellow-400
              transition-all duration-100
              shadow-xl shadow-purple-500/30
              hover:shadow-yellow-400/50
            "
            title="Go Back"
          >
            <ChevronLeft className="w-20 h-20 text-purple-300" />
          </motion.button>
        ) : hoveredItem ? (
          // HOVERED ITEM DISPLAY
          <motion.div
            key={`hovered-${hoveredItem.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.05 }}
            className="
              w-40 h-40 rounded-full
              bg-gray-900/90 backdrop-blur-md
              border-4 border-purple-400
              flex flex-col items-center justify-center
              p-4
              shadow-xl
            "
            style={{
              animation: 'pulse-glow 2s ease-in-out infinite'
            }}
          >
            <ImageWithFallback
              key={hoveredItem.primaryIcon}
              src={hoveredItem.primaryIcon}
              alt={hoveredItem.primaryLabel}
              className="w-20 h-20 rounded-lg mb-2"
              fallbackIcon="✨"
            />
            <div className="text-sm font-semibold text-white text-center truncate w-full px-2">
              {hoveredItem.primaryLabel}
            </div>
          </motion.div>
        ) : (
          // STATE INDICATOR TEXT
          <motion.div
            key="state-indicator"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.05 }}
            className="
              w-40 h-40 rounded-full
              bg-gray-900/60 backdrop-blur-sm
              border-2 border-purple-500/40
              flex items-center justify-center
              p-5
              shadow-lg
            "
          >
            <div className="text-sm text-purple-300 text-center font-medium leading-tight">
              {getStateText()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CSS for pulse glow animation */}
      <style>{`
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(168, 85, 247, 0.5);
          }
          50% {
            box-shadow: 0 0 30px rgba(168, 85, 247, 0.8);
          }
        }
      `}</style>
    </div>
  );
};

export default RadialCenterDisplay;
