import { useVotes } from "@/hooks/useVotes";
import { VoteWithParks } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw, ImageIcon } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { useState } from "react";

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

interface VoteItemProps {
  vote: VoteWithParks;
}

const VoteItem = ({ vote }: VoteItemProps) => {
  const isPositive = vote.winnerEloChange > 0;
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState(vote.winner.imageUrl);
  
  const handleImageError = () => {
    if (!imageError) {
      setImageError(true);
      setImageSrc(getFallbackImage(vote.winner.id));
    }
  };
  
  return (
    <div className="flex items-center border-b border-neutral-200 pb-4 last:border-b-0 last:pb-0">
      <div className="mr-4 w-16 h-16 rounded-full bg-neutral-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
        {imageError && imageSrc === getFallbackImage(vote.winner.id) ? (
          <ImageIcon className="w-8 h-8 text-neutral-400" />
        ) : (
          <img 
            src={imageSrc} 
            alt={vote.winner.name} 
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        )}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <div className="font-medium">{vote.winner.name}</div>
          <div className={`${isPositive ? "text-green-500" : "text-red-500"} font-medium text-sm`}>
            {isPositive ? "+" : ""}{vote.winnerEloChange} ELO
          </div>
        </div>
        <div className="text-sm text-neutral-700">
          Won against <span className="font-medium">{vote.loser.name}</span>
        </div>
        <div className="mt-1 text-xs text-neutral-500">
          {formatDistanceToNow(new Date(vote.timestamp), { addSuffix: true })}
        </div>
      </div>
    </div>
  );
};

const VotesSkeleton = () => {
  return (
    <div className="space-y-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center border-b border-neutral-200 pb-4">
          <Skeleton className="mr-4 w-16 h-16 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-5 w-3/4 mb-2" />
            <Skeleton className="h-4 w-2/3 mb-2" />
            <Skeleton className="h-3 w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
};

interface RecentVotesProps {
  limit?: number;
}

const RecentVotes = ({ limit = 4 }: RecentVotesProps) => {
  const { votes, isLoading } = useVotes(limit);

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/votes/recent"] });
  };

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-bold text-2xl">Recent Voting Activity</h2>
        <button 
          className="text-sm text-accent hover:text-accent/80 transition-colors flex items-center"
          onClick={handleRefresh}
        >
          Refresh <RefreshCw className="ml-1 h-4 w-4" />
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        {isLoading ? (
          <VotesSkeleton />
        ) : votes && votes.length > 0 ? (
          <div className="space-y-6">
            {votes.map((vote) => (
              <VoteItem key={vote.id} vote={vote} />
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-neutral-500">
            No votes recorded yet. Vote on matchups to see the activity here!
          </div>
        )}
      </div>
    </section>
  );
};

export default RecentVotes;
