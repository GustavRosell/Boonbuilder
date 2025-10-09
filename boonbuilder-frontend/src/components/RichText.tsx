/**
 * RichText - Formatted Text Display for Arcana Cards and Game Descriptions
 *
 * Processes text to:
 * - Replace game terms with icons (Health, Magick, Grasp, Gold, elements, etc.)
 * - Color-code rank values (white/blue/purple/orange)
 * - Bold specific game terms
 * - Apply rarity colors (Rare, Legendary, Duo, Epic)
 */

import React from 'react';
import ImageWithFallback from './ImageWithFallback';

interface RichTextProps {
  text: string;
  className?: string;
}

// Icon mappings for game terms
const ICON_REPLACEMENTS: Record<string, { path: string; alt: string; size?: string }> = {
  // Resources
  'Health': { path: '/images/Other/Life.webp', alt: 'Health', size: 'w-4 h-4' },
  'Life': { path: '/images/Other/Life.webp', alt: 'Life', size: 'w-4 h-4' },
  'Magick': { path: '/images/Other/Mana.webp', alt: 'Magick', size: 'w-4 h-4' },
  'Magicka': { path: '/images/Other/Mana.webp', alt: 'Magicka', size: 'w-4 h-4' },
  'Grasp': { path: '/images/Other/Grasp.webp', alt: 'Grasp', size: 'w-4 h-4' },
  'Gold': { path: '/images/Other/Gold.webp', alt: 'Gold', size: 'w-4 h-4' },
  'Coins': { path: '/images/Other/Gold.webp', alt: 'Coins', size: 'w-4 h-4' },

  // Upgrades
  'MagickUp': { path: '/images/Other/ManaUp.webp', alt: 'Magick Up', size: 'w-4 h-4' },
  'ManaUp': { path: '/images/Other/ManaUp.webp', alt: 'Mana Up', size: 'w-4 h-4' },
  'HealthUp': { path: '/images/Other/LifeUp.webp', alt: 'Health Up', size: 'w-4 h-4' },
  'LifeUp': { path: '/images/Other/LifeUp.webp', alt: 'Life Up', size: 'w-4 h-4' },

  // Special abilities
  'Death Defiance': { path: '/images/Other/Death_Defiance.webp', alt: 'Death Defiance', size: 'w-4 h-4' },
  'Change of Fate': { path: '/images/Other/Change_of_Fate.webp', alt: 'Change of Fate', size: 'w-4 h-4' },

  // Elements
  'Fire': { path: '/images/elements/Element_Fire_logo.webp', alt: 'Fire', size: 'w-4 h-4' },
  'Earth': { path: '/images/elements/Element_Earth_logo.webp', alt: 'Earth', size: 'w-4 h-4' },
  'Water': { path: '/images/elements/Element_Water_logo.webp', alt: 'Water', size: 'w-4 h-4' },
  'Air': { path: '/images/elements/Element_Air_logo.webp', alt: 'Air', size: 'w-4 h-4' },
  'Aether': { path: '/images/elements/Element_Aether_logo.webp', alt: 'Aether', size: 'w-4 h-4' },
};

// Terms that should be bolded
const BOLD_TERMS = [
  'Channel',
  'Ω Moves',
  'ΩMoves',
  'Ω Move',
  'Ω Combo',
  'ΩCombo',
  'Sec.',
  'Casts',
  'Impervious',
  'Critical',
  'Sprint',
  'Death Defiance',
  'Locations',
  'Curses',
  'Location Rewards',
  'Minor Find',
  'Major Find',
  'Boons',
  'Guardians',
];

// Rarity terms with colors
const RARITY_COLORS: Record<string, string> = {
  'Rare': 'text-blue-400',
  'Epic': 'text-purple-400',
  'Legendary': 'text-orange-400',
  'Duo': 'text-yellow-400',
};

// Rank value colors
const RANK_COLORS = [
  'text-white',      // Rank 1
  'text-blue-400',   // Rank 2
  'text-purple-400', // Rank 3
  'text-orange-400', // Rank 4 (Heroic)
];

interface TextSegment {
  type: 'text' | 'icon' | 'bold' | 'rarity' | 'ranks';
  content: string;
  iconData?: { path: string; alt: string; size?: string };
  className?: string;
  rankValues?: string[];
}

/**
 * Parse text into segments that can be individually formatted
 */
const parseText = (text: string): TextSegment[] => {
  const segments: TextSegment[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    let matched = false;

    // Check for rank value patterns first (e.g., "20/25/30/35%" or "1/2/3/4")
    const rankPattern = /^(\d+)\/(\d+)\/(\d+)\/(\d+)(%?)/;
    const rankMatch = remaining.match(rankPattern);
    if (rankMatch) {
      segments.push({
        type: 'ranks',
        content: rankMatch[0],
        rankValues: [rankMatch[1], rankMatch[2], rankMatch[3], rankMatch[4]],
        className: rankMatch[5], // Store the % if present
      });
      remaining = remaining.slice(rankMatch[0].length);
      continue;
    }

    // Check for icon replacements (prioritize longer matches to avoid partial matches)
    const sortedIconKeys = Object.keys(ICON_REPLACEMENTS).sort((a, b) => b.length - a.length);
    for (const term of sortedIconKeys) {
      if (remaining.startsWith(term)) {
        // Add the icon
        segments.push({
          type: 'icon',
          content: term,
          iconData: ICON_REPLACEMENTS[term],
        });

        remaining = remaining.slice(term.length);
        matched = true;
        break;
      }
    }

    if (matched) continue;

    // Check for rarity terms
    let rarityMatched = false;
    for (const rarity of Object.keys(RARITY_COLORS)) {
      if (remaining.startsWith(rarity)) {
        // Check if it's a standalone word (not part of a larger word)
        const nextChar = remaining[rarity.length];
        if (!nextChar || /[\s,.]/.test(nextChar)) {
          segments.push({
            type: 'rarity',
            content: rarity,
            className: RARITY_COLORS[rarity],
          });
          remaining = remaining.slice(rarity.length);
          rarityMatched = true;
          break;
        }
      }
    }

    if (rarityMatched) continue;

    // Check for bold terms (prioritize longer matches)
    let boldMatched = false;
    const sortedBoldTerms = BOLD_TERMS.sort((a, b) => b.length - a.length);
    for (const term of sortedBoldTerms) {
      if (remaining.startsWith(term)) {
        segments.push({
          type: 'bold',
          content: term,
        });
        remaining = remaining.slice(term.length);
        boldMatched = true;
        break;
      }
    }

    if (boldMatched) continue;

    // No matches, take the next character as plain text
    segments.push({ type: 'text', content: remaining[0] });
    remaining = remaining.slice(1);
  }

  // Merge consecutive text segments for efficiency
  const mergedSegments: TextSegment[] = [];
  for (const segment of segments) {
    if (segment.type === 'text' && mergedSegments.length > 0 && mergedSegments[mergedSegments.length - 1].type === 'text') {
      mergedSegments[mergedSegments.length - 1].content += segment.content;
    } else {
      mergedSegments.push(segment);
    }
  }

  return mergedSegments;
};

const RichText: React.FC<RichTextProps> = ({ text, className = '' }) => {
  const segments = parseText(text);

  return (
    <span className={className} style={{ whiteSpace: 'normal' }}>
      {segments.map((segment, index) => {
        switch (segment.type) {
          case 'icon':
            return (
              <span key={index} className="inline-block align-text-bottom mx-0.5">
                <ImageWithFallback
                  key={segment.iconData!.path}
                  src={segment.iconData!.path}
                  alt={segment.iconData!.alt}
                  className={`inline-block ${segment.iconData!.size || 'w-4 h-4'}`}
                  fallbackIcon="◆"
                />
              </span>
            );

          case 'ranks':
            return (
              <span key={index} className="inline-flex items-baseline">
                {segment.rankValues!.map((value, rankIndex) => (
                  <React.Fragment key={rankIndex}>
                    <span className={RANK_COLORS[rankIndex]}>{value}</span>
                    {rankIndex < segment.rankValues!.length - 1 && <span className="text-gray-500">/</span>}
                  </React.Fragment>
                ))}
                {segment.className && <span className="text-gray-400">{segment.className}</span>}
              </span>
            );

          case 'bold':
            return (
              <span key={index} className="font-bold">
                {segment.content}
              </span>
            );

          case 'rarity':
            return (
              <span key={index} className={`font-bold ${segment.className}`}>
                {segment.content}
              </span>
            );

          case 'text':
          default:
            return <span key={index}>{segment.content}</span>;
        }
      })}
    </span>
  );
};

export default RichText;
