import { useState, useCallback, useEffect } from "react";
import parkImages from "../park_images.json";

// Define the type for the park images JSON
type ParkImagesType = {
  [key: string]: string;
};

// Cast the imported JSON to the proper type
const typedParkImages = parkImages as ParkImagesType;

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

  // Check if the initial URL is a Wikimedia URL, which might have CORS issues
  // or is an empty string, then preemptively use the fallback
  useEffect(() => {
    if (!initialUrl || initialUrl.trim() === '' || 
        (initialUrl.includes('wikipedia.org') || initialUrl.includes('wikimedia.org'))) {
      // Always use fallback image for Wikipedia/Wikimedia sources due to CORS issues
      const parkIdStr = parkId.toString();
      const fallbackImage = typedParkImages[parkIdStr];
      if (fallbackImage) {
        console.log(`Using initial fallback for park ${parkId}: ${fallbackImage}`);
        setImageSrc(fallbackImage);
        setIsError(true);
      }
    }
  }, [parkId, initialUrl]);

  const handleImageError = useCallback(() => {
    if (!isError) {
      // Only switch to fallback once to avoid infinite loops
      setIsError(true);
      // Get the fallback image from our mapping
      const parkIdStr = parkId.toString();
      const fallbackImage = typedParkImages[parkIdStr];
      if (fallbackImage) {
        console.log(`Using fallback for park ${parkId}: ${fallbackImage}`);
        setImageSrc(fallbackImage);
      } else {
        console.error(`No fallback found for park ID: ${parkId}`);
      }
    }
  }, [isError, parkId]);

  return {
    imageSrc,
    isError,
    handleImageError
  };
}