import { Park } from "@shared/schema";
import { MapPin, ChevronRight, ImageIcon } from "lucide-react";
import { useState } from "react";

interface ParkCardProps {
  park: Park & { rank: number };
}

// Default fallback images for when external images fail to load
const fallbackImages = [
  "https://images.unsplash.com/photo-1544979590-37e9b47eb705?w=600&h=400&fit=crop", // Tiger
  "https://images.unsplash.com/photo-1503656142023-618e7d1f435a?w=600&h=400&fit=crop", // Forest
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=400&fit=crop", // Nature
  "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=600&h=400&fit=crop", // Mountains
  "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=600&h=400&fit=crop", // Wildlife
];

// Get a deterministic fallback image based on park id
const getFallbackImage = (id: number) => {
  return fallbackImages[id % fallbackImages.length];
};

const ParkCard = ({ park }: ParkCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState(park.imageUrl);
  
  const handleImageError = () => {
    if (!imageError) {
      // Only try fallback once to avoid infinite loops
      setImageError(true);
      setImageSrc(getFallbackImage(park.id));
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-40 bg-neutral-200 flex items-center justify-center">
        {imageError && imageSrc === getFallbackImage(park.id) ? (
          // If even fallback fails, show icon
          <div className="flex flex-col items-center justify-center text-neutral-400">
            <ImageIcon className="h-10 w-10 mb-1" />
            <span className="text-xs">Image unavailable</span>
          </div>
        ) : (
          <img 
            src={imageSrc}
            alt={park.name}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        )}
        <div className="absolute top-0 left-0 bg-primary/90 text-white text-xs font-medium px-2 py-1 m-2 rounded-full">
          Rank #{park.rank}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-md mb-1">{park.name}</h3>
        <div className="flex items-center text-xs text-neutral-700 mb-2">
          <MapPin className="h-3 w-3 mr-1 text-secondary" />
          <span>{park.location}</span>
        </div>
        <div className="flex items-center justify-between text-xs mt-2">
          <span className="text-neutral-500">ELO: <span className="font-medium text-neutral-900">{park.elo}</span></span>
          <button className="text-accent hover:text-accent/80 flex items-center">
            Details <ChevronRight className="ml-1 h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParkCard;
