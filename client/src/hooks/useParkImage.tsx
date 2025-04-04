import { useState, useCallback } from "react";
import parkImages from "../park_images.json";

/**
 * A hook to handle park images with fallback to our local images
 * 
 * @param parkId The ID of the park
 * @param initialUrl The initial image URL from the park data
 * @returns Image src URL and error handling utilities
 */
export function useParkImage(parkId: number, initialUrl: string) {
  const [isError, setIsError] = useState(false);
  const [imageSrc, setImageSrc] = useState(initialUrl);

  const handleImageError = useCallback(() => {
    if (!isError) {
      // Only switch to fallback once to avoid infinite loops
      setIsError(true);
      // Get the fallback image from our mapping
      const fallbackImage = parkImages[parkId.toString()];
      setImageSrc(fallbackImage);
    }
  }, [isError, parkId]);

  return {
    imageSrc,
    isError,
    handleImageError
  };
}