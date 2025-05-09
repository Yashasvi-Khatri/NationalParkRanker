import { Park } from "@shared/schema";
import { MapPin, ChevronRight, ImageIcon } from "lucide-react";
import { useParkImage } from "@/hooks/useParkImage";
import { useEffect } from "react";

interface ParkCardProps {
  park: Park & { rank: number };
}

const ParkCard = ({ park }: ParkCardProps) => {
  const { imageSrc, isError, handleImageError } = useParkImage(park.id, park.imageUrl);
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-40 bg-neutral-200 flex items-center justify-center">
        {isError ? (
          // If we have a fallback image source, show it
          imageSrc ? (
            <img 
              src={imageSrc}
              alt={park.name}
              className="w-full h-full object-cover"
              onError={() => {
                console.error(`Fallback image failed to load for park ${park.id}`);
              }}
            />
          ) : (
            // If fallback fails or doesn't exist, show icon
            <div className="flex flex-col items-center justify-center text-neutral-400">
              <ImageIcon className="h-10 w-10 mb-1" />
              <span className="text-xs">Image unavailable</span>
            </div>
          )
        ) : (
          // Original image with error handler
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
