/**
 * Radial Menu Utilities
 *
 * Helper functions for Enhanced Radial Menu positioning and theming
 */

/**
 * Calculate polar coordinates for radial menu item placement
 * @param index - Item index in the radial
 * @param total - Total number of items
 * @param radius - Distance from center in pixels
 * @returns {x, y} position relative to center
 */
export const calculatePolarPosition = (
  index: number,
  total: number,
  radius: number = 420
): { x: number; y: number } => {
  // Start at top (-90°) and distribute evenly around circle
  const angleInDegrees = (index * (360 / total)) - 90;
  const angleInRadians = (angleInDegrees * Math.PI) / 180;

  return {
    x: Math.cos(angleInRadians) * radius,
    y: Math.sin(angleInRadians) * radius
  };
};

/**
 * God-specific color theming for visual differentiation
 */
export const godColors: Record<string, string> = {
  // Olympian Gods
  'Zeus': '#3b82f6',        // Blue - Lightning/Sky
  'Aphrodite': '#ec4899',   // Pink - Love/Beauty
  'Apollo': '#eab308',      // Yellow - Sun/Light
  'Hephaestus': '#f97316',  // Orange - Fire/Forge
  'Hera': '#a855f7',        // Purple - Royalty
  'Poseidon': '#06b6d4',    // Cyan - Ocean
  'Demeter': '#22c55e',     // Green - Nature/Growth
  'Artemis': '#10b981',     // Emerald - Hunt/Moon
  'Athena': '#8b5cf6',      // Violet - Wisdom
  'Hestia': '#f59e0b',      // Amber - Hearth/Fire

  // Other Gods
  'Hermes': '#facc15',      // Light Yellow - Speed/Messages
  'Hecate': '#7c3aed',      // Deep Purple - Magic/Witchcraft
  'Chaos': '#9333ea',       // Dark Purple - Primordial
  'Selene': '#60a5fa',      // Light Blue - Moon
  'Moros': '#6366f1',       // Indigo - Doom/Fate
  'Narcissus': '#f0abfc',   // Light Pink - Vanity
  'Echo': '#d8b4fe',        // Lavender - Voice/Sound
  'Nemesis': '#dc2626',     // Red - Vengeance
  'Arachne': '#78350f',     // Brown - Weaving
  'Dora': '#fb923c',        // Light Orange - Gifts
  'Odysseus': '#0891b2',    // Teal - Journey/Cunning
  'Circe': '#c026d3',       // Magenta - Transformation/Sorcery
};

/**
 * Get color for a god by name
 * @param godName - Name of the god
 * @param fallback - Default color if god not found
 * @returns Hex color string
 */
export const getGodColor = (godName: string, fallback: string = '#a855f7'): string => {
  return godColors[godName] || fallback;
};

/**
 * Get shadow glow effect for god-specific theming
 * @param godName - Name of the god
 * @returns Tailwind shadow class
 */
export const getGodGlow = (godName: string): string => {
  const color = getGodColor(godName);
  return `shadow-[0_0_20px_${color}40]`; // 40 = 25% opacity
};

/**
 * Convert item count to optimal radius
 * Adjusts radius based on number of items to prevent overlap
 * @param itemCount - Number of items in radial
 * @returns Optimal radius in pixels
 */
export const calculateOptimalRadius = (itemCount: number): number => {
  if (itemCount <= 5) return 380;
  if (itemCount <= 8) return 420;
  if (itemCount <= 12) return 460;
  return 500; // For 12+ items
};

/**
 * Get stagger delay for item entrance animations
 * @param index - Item index
 * @param delayMs - Base delay between items
 * @returns Delay in seconds
 */
export const getStaggerDelay = (index: number, delayMs: number = 20): number => {
  return index * (delayMs / 1000);
};
