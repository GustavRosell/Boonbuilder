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
      <div className={`flex items-center justify-center bg-purple-600 text-white ${className}`}>
        <span className="text-2xl">{fallbackIcon}</span>
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading && (
        <div className={`absolute inset-0 flex items-center justify-center bg-purple-600/50 ${className}`}>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <img
        src={currentSrc}
        alt={alt}
        className={className}
        onError={handleImageError}
        onLoad={handleImageLoad}
        style={{ display: isLoading ? 'none' : 'block' }}
      />
    </div>
  );
};

export default ImageWithFallback;