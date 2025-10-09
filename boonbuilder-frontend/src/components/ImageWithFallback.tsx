import React, { useState, useEffect, useRef } from 'react';

interface ImageWithFallbackProps {
  src?: string | null;
  alt: string;
  className?: string;
  imageClassName?: string;
  fallbackIcon?: string;
}

/**
 * ImageWithFallback Component
 *
 * Displays images with a fallback chain: .webp → .png → .svg → fallback icon
 * Shows a loading spinner during image load
 *
 * Features:
 * - Automatic fallback chain for missing images
 * - Handles empty/null src values immediately (no spinner)
 * - Proper state management with useEffect for src changes
 * - Cached image detection (shows immediately if already loaded)
 * - Case-insensitive extension handling with query string support
 */

const getFallbackSource = (source: string): string | null => {
  // Split off query params to preserve them
  const [path, query] = source.split('?', 2);
  const suffix = query ? `?${query}` : '';
  const lowerPath = path.toLowerCase();

  // Try fallback extensions: .webp → .png → .svg
  if (lowerPath.endsWith('.webp')) {
    return `${path.slice(0, -5)}.png${suffix}`;
  } else if (lowerPath.endsWith('.png')) {
    return `${path.slice(0, -4)}.svg${suffix}`;
  }
  return null; // No more fallbacks
};

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className = '',
  imageClassName = '',
  fallbackIcon = '?'
}) => {
  // Sanitize src input - handle null/undefined/empty strings
  const sanitizedSrc = typeof src === 'string' ? src.trim() : '';

  const [currentSrc, setCurrentSrc] = useState<string | null>(sanitizedSrc || null);
  const [imageError, setImageError] = useState(!sanitizedSrc); // Immediate error if no src
  const [isLoading, setIsLoading] = useState(!!sanitizedSrc); // Only load if we have a src
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Reset state when src prop changes (critical for hover image updates)
  useEffect(() => {
    if (!sanitizedSrc) {
      // No valid src - show fallback immediately
      setCurrentSrc(null);
      setImageError(true);
      setIsLoading(false);
      return;
    }

    setCurrentSrc(sanitizedSrc);
    setImageError(false);
    setIsLoading(true);
  }, [sanitizedSrc]);

  // Check if image is already cached (complete and has dimensions)
  useEffect(() => {
    if (!currentSrc || !isLoading) return;

    const el = imgRef.current;
    if (el && el.complete && el.naturalWidth > 0) {
      // Image was already cached, show immediately
      setIsLoading(false);
    }
  }, [currentSrc, isLoading]);

  const handleImageError = () => {
    if (!currentSrc) {
      setImageError(true);
      setIsLoading(false);
      return;
    }

    const fallbackSrc = getFallbackSource(currentSrc);
    if (fallbackSrc && fallbackSrc !== currentSrc) {
      // Try next fallback in chain
      setCurrentSrc(fallbackSrc);
      setIsLoading(true);
      return;
    }

    // No more fallbacks, show fallback icon
    setImageError(true);
    setIsLoading(false);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const showImage = !!currentSrc && !imageError;
  const imageClasses = [
    'w-full',
    'h-full',
    'object-cover',
    'transition-opacity',
    'duration-200',
    imageClassName,
    isLoading ? 'opacity-0' : 'opacity-100'
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={`relative ${className}`}>
      {showImage ? (
        <>
          {/* Loading Spinner */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-purple-600/30 rounded">
              <div className="w-1/3 h-1/3 max-w-[24px] max-h-[24px] border-2 border-purple-300 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* Image */}
          <img
            ref={imgRef}
            src={currentSrc ?? undefined}
            alt={alt}
            className={imageClasses}
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
        </>
      ) : (
        /* Fallback Icon */
        <div className="absolute inset-0 flex items-center justify-center bg-purple-600/30 rounded text-white">
          <span className="text-2xl opacity-50">{fallbackIcon}</span>
        </div>
      )}
    </div>
  );
};

export default ImageWithFallback;