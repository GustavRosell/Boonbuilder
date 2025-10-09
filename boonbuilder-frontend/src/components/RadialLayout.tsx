/**
 * RadialLayout Component
 *
 * Pure visual component that arranges items in a circular pattern
 * Handles positioning, animations, and user interactions
 */

import React from 'react';
import { AnimatePresence } from 'framer-motion';
import RadialItemCard, { RadialItem } from './RadialItemCard';
import { calculatePolarPosition, calculateOptimalRadius } from '../utils/radialUtils';

interface RadialLayoutProps {
  items: RadialItem[];
  radius?: number;  // Optional custom radius, auto-calculated if not provided
  onItemClick: (item: RadialItem, index: number) => void;
  onItemHover: (item: RadialItem | null, index: number | null) => void;
  hoveredIndex: number | null;
}

const RadialLayout: React.FC<RadialLayoutProps> = ({
  items,
  radius,
  onItemClick,
  onItemHover,
  hoveredIndex
}) => {
  // Calculate optimal radius based on item count if not provided
  const effectiveRadius = radius || calculateOptimalRadius(items.length);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Items positioned in circle */}
      <AnimatePresence>
        {items.map((item, index) => {
          const position = calculatePolarPosition(index, items.length, effectiveRadius);

          return (
            <div
              key={item.id}
              className="absolute"
              style={{
                left: `calc(50% + ${position.x}px)`,
                top: `calc(50% + ${position.y}px)`,
                transform: 'translate(-50%, -50%)',
                zIndex: hoveredIndex === index ? 20 : 10
              }}
            >
              <RadialItemCard
                item={item}
                index={index}
                isHovered={hoveredIndex === index}
                onClick={() => !item.isLocked && onItemClick(item, index)}
                onMouseEnter={() => onItemHover(item, index)}
                onMouseLeave={() => onItemHover(null, null)}
              />
            </div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default RadialLayout;
