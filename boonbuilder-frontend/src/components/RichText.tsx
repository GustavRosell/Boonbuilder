import React from 'react';

interface RichTextProps {
  text: string;
  className?: string;
}

// Icon mapping for game terms
const ICON_MAP: Record<string, { src: string; alt: string; className: string }> = {
  'Magick': {
    src: '/images/Other/Magick_Logo.webp',
    alt: 'Magick',
    className: 'inline-block w-4 h-4 align-text-bottom mx-0.5'
  },
  'Fire': {
    src: '/images/elements/Element_Fire_logo.webp',
    alt: 'Fire',
    className: 'inline-block w-4 h-4 align-text-bottom mx-0.5'
  },
  'Earth': {
    src: '/images/elements/Element_Earth_logo.webp',
    alt: 'Earth',
    className: 'inline-block w-4 h-4 align-text-bottom mx-0.5'
  },
  'Water': {
    src: '/images/elements/Element_Water_logo.webp',
    alt: 'Water',
    className: 'inline-block w-4 h-4 align-text-bottom mx-0.5'
  },
  'Air': {
    src: '/images/elements/Element_Air_logo.webp',
    alt: 'Air',
    className: 'inline-block w-4 h-4 align-text-bottom mx-0.5'
  },
  'Aether': {
    src: '/images/elements/Element_Aether_logo.webp',
    alt: 'Aether',
    className: 'inline-block w-4 h-4 align-text-bottom mx-0.5'
  },
  // Future: Add more game icons here
  // 'Health': { src: '/images/Other/Health_Logo.webp', alt: 'Health', className: '...' },
  // 'Armor': { src: '/images/Other/Armor_Logo.webp', alt: 'Armor', className: '...' },
};

/**
 * RichText component that replaces specific keywords (like "Magick") with inline icons.
 * This makes game descriptions more visually authentic by showing game icons instead of text.
 *
 * @param text - The description text to parse
 * @param className - Optional CSS classes for the container
 */
const RichText: React.FC<RichTextProps> = ({ text, className = '' }) => {
  // Create regex pattern that matches any keyword in the icon map
  const keywords = Object.keys(ICON_MAP).join('|');
  const regex = new RegExp(`(${keywords})`, 'g');

  // Split text by keywords while keeping the keywords in the array
  const parts = text.split(regex);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        const iconConfig = ICON_MAP[part];

        // If this part matches a keyword, render the icon
        if (iconConfig) {
          return (
            <img
              key={index}
              src={iconConfig.src}
              alt={iconConfig.alt}
              className={iconConfig.className}
              title={iconConfig.alt}
            />
          );
        }

        // Otherwise, render the text as-is
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
};

export default RichText;
