import { Park } from "@shared/schema";
import { useRankings } from "@/hooks/useRankings";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUp, ArrowDown, Minus, ImageIcon } from "lucide-react";
import { Link } from "wouter";
import { useState, useCallback } from "react";

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

// Row item for park image
const ParkTableRow = ({ park }: { park: Park & { rank: number; winRate: number } }) => {
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState(park.imageUrl);
  
  const handleImageError = useCallback(() => {
    if (!imageError) {
      setImageError(true);
      setImageSrc(getFallbackImage(park.id));
    }
  }, [imageError, park.id]);
  
  const getTrendIcon = useCallback(() => {
    // For simplicity, we're simulating trends
    // In a real app, this would compare current rank with previous rank
    const random = Math.floor(Math.random() * 3);
    if (random === 0) {
      return <ArrowUp className="text-green-500 h-4 w-4" />;
    } else if (random === 1) {
      return <ArrowDown className="text-red-500 h-4 w-4" />;
    } else {
      return <Minus className="text-neutral-500 h-4 w-4" />;
    }
  }, []);
  
  return (
    <tr className="hover:bg-neutral-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">#{park.rank}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="h-10 w-10 flex-shrink-0 rounded overflow-hidden mr-3 bg-neutral-200 flex items-center justify-center">
            {imageError && imageSrc === getFallbackImage(park.id) ? (
              <ImageIcon className="h-5 w-5 text-neutral-400" />
            ) : (
              <img 
                src={imageSrc} 
                alt={park.name} 
                className="h-full w-full object-cover"
                onError={handleImageError}
              />
            )}
          </div>
          <div className="text-sm font-medium">{park.name}</div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">{park.location}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">{park.elo}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        {park.winRate}% ({park.wins}-{park.losses})
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm flex items-center">
        {getTrendIcon()}
        <span className="ml-1">{Math.floor(Math.random() * 5)}</span>
      </td>
    </tr>
  );
};

const RankingsSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between mb-4">
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-8 w-1/4" />
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center py-3 border-b">
          <Skeleton className="h-10 w-10 rounded-full mr-3" />
          <Skeleton className="h-6 flex-1" />
        </div>
      ))}
    </div>
  );
};

interface RankingsTableProps {
  limit?: number;
  showViewMore?: boolean;
}

const RankingsTable = ({ limit, showViewMore = true }: RankingsTableProps) => {
  const { parks, isLoading, sortOption, setSortOption } = useRankings();
  const displayedParks = limit ? parks.slice(0, limit) : parks;

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-bold text-2xl">Current Rankings</h2>
        <div className="flex items-center">
          <span className="text-sm text-neutral-500 mr-2">Sort by:</span>
          <Select
            value={sortOption}
            onValueChange={(value) => setSortOption(value as any)}
          >
            <SelectTrigger className="text-sm w-[150px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="elo">ELO Rating</SelectItem>
              <SelectItem value="name">Alphabetical</SelectItem>
              <SelectItem value="votes">Most Voted</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <RankingsSkeleton />
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-neutral-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">Park</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">ELO Rating</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">W/L Ratio</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {displayedParks.map((park) => (
                <ParkTableRow key={park.id} park={park} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showViewMore && (
        <div className="mt-4 text-center">
          <Link href="/rankings" className="text-accent hover:text-accent/80 transition-colors font-medium flex items-center justify-center">
            View All Rankings <ArrowUp className="ml-1 h-4 w-4 rotate-90" />
          </Link>
        </div>
      )}
    </section>
  );
};

export default RankingsTable;
