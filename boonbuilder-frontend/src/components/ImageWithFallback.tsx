import React, { useState, useEffect } from 'react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  fallbackIcon?: string;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className = '',
  fallbackIcon = '?'
}) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Reset state when src prop changes
  useEffect(() => {
    setCurrentSrc(src);
    setImageError(false);
    setIsLoading(true);
  }, [src]);

  // Add timeout to prevent infinite loading (1 second for quick hover feedback)
  useEffect(() => {
    if (!isLoading) return;

    const timeoutId = setTimeout(() => {
      if (isLoading) {
        // If still loading after 1 second, show fallback
        setImageError(true);
        setIsLoading(false);
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [isLoading]);

  const handleImageError = () => {
    // Try fallback chain: .webp → .png → .svg
    if (currentSrc.endsWith('.webp')) {
      const pngFallback = currentSrc.replace('.webp', '.png');
      setCurrentSrc(pngFallback);
      setIsLoading(true);
      return;
    }

    if (currentSrc.endsWith('.png')) {
      const svgFallback = currentSrc.replace('.png', '.svg');
      setCurrentSrc(svgFallback);
      setIsLoading(true);
      return;
    }

    // If all attempts fail, show fallback icon
    setImageError(true);
    setIsLoading(false);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  if (imageError) {
    // Fallback to icon/emoji when image fails to load
    return (
      <div className={`flex items-center justify-center bg-purple-600/30 text-white ${className}`}>
        <span className="text-2xl opacity-50">{fallbackIcon}</span>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-purple-600/30 rounded">
          <div className="w-1/3 h-1/3 max-w-[24px] max-h-[24px] border-2 border-purple-300 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <img
        src={currentSrc}
        alt={alt}
        className={`w-full h-full ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
        onError={handleImageError}
        onLoad={handleImageLoad}
      />
    </div>
  );
};

export default ImageWithFallback;