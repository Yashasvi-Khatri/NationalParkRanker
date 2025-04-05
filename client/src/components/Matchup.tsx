import { Button } from "@/components/ui/button";
import { useMatchup } from "@/hooks/useMatchup";
import { Park } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, ArrowRight, ImageIcon } from "lucide-react";
import { Loader2 } from "lucide-react";
import { useParkImage } from "@/hooks/useParkImage";
import { useEffect } from "react";

interface ParkCardProps {
  park: Park;
  isSubmitting: boolean;
  onVote: () => void;
}

const ParkCard = ({ park, isSubmitting, onVote }: ParkCardProps) => {
  const { imageSrc, isError, handleImageError } = useParkImage(park.id, park.imageUrl);

  // Debugging log to help track image loading issues
  useEffect(() => {
    console.log(`Matchup Park ${park.id}: Image source ${imageSrc}, isError: ${isError}`);
  }, [park.id, imageSrc, isError]);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border-2 border-transparent hover:border-accent transition-all">
      <div className="relative h-64 bg-neutral-200 flex items-center justify-center">
        {isError ? (
          // If we have a fallback image source, show it
          imageSrc && !imageSrc.includes('wikipedia') && !imageSrc.includes('wikimedia') ? (
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
              <ImageIcon className="h-16 w-16 mb-2" />
              <span className="text-sm">Image unavailable</span>
            </div>
          )
        ) : (
          <img 
            src={imageSrc} 
            alt={park.name} 
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        )}
        <div className="absolute top-0 left-0 bg-primary/90 text-white text-sm font-medium px-3 py-1 m-2 rounded-full">
          ELO Rank
        </div>
        <div className="absolute top-0 right-0 bg-white/80 text-primary text-sm font-medium px-3 py-1 m-2 rounded-full">
          ELO: {park.elo}
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="font-bold text-xl mb-2">{park.name}</h3>
        <div className="flex items-center text-sm text-neutral-700 mb-4">
          <MapPin className="h-4 w-4 mr-2 text-secondary" />
          <span>{park.location}</span>
        </div>
        
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <span className="text-sm font-medium text-neutral-700 w-24">Established:</span>
            <span className="text-sm text-neutral-900">{park.formed}</span>
          </div>
          <div className="flex items-center mb-2">
            <span className="text-sm font-medium text-neutral-700 w-24">Features:</span>
            <span className="text-sm text-neutral-900">{park.notableFeatures}</span>
          </div>
          <div className="flex items-center">
            <span className="text-sm font-medium text-neutral-700 w-24">Wildlife:</span>
            <span className="text-sm text-neutral-900">{park.floraAndFauna}</span>
          </div>
        </div>
        
        <Button 
          className="w-full"
          onClick={onVote}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Vote For This Park"
          )}
        </Button>
      </div>
    </div>
  );
};

const MatchupSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <Skeleton className="w-full h-64" />
        <div className="p-6">
          <Skeleton className="h-6 w-3/4 mb-4" />
          <Skeleton className="h-4 w-1/2 mb-6" />
          <div className="space-y-2 mb-6">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <Skeleton className="w-full h-64" />
        <div className="p-6">
          <Skeleton className="h-6 w-3/4 mb-4" />
          <Skeleton className="h-4 w-1/2 mb-6" />
          <div className="space-y-2 mb-6">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  );
};

const Matchup = () => {
  const { 
    matchup, 
    isLoading, 
    submitVote, 
    isSubmittingVote,
    skipMatchup,
    isSkippingMatchup
  } = useMatchup();

  const handleVote = (winnerId: number, loserId: number) => {
    submitVote({ winnerId, loserId });
  };

  return (
    <section className="mb-12" id="current-matchup">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-bold text-2xl">Current Matchup</h2>
        <div className="text-sm text-neutral-500">
          Match #{matchup?.id || ""}
        </div>
      </div>

      {isLoading ? (
        <MatchupSkeleton />
      ) : matchup ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          <ParkCard 
            park={matchup.park1} 
            isSubmitting={isSubmittingVote} 
            onVote={() => handleVote(matchup.park1.id, matchup.park2.id)}
          />
          <ParkCard 
            park={matchup.park2} 
            isSubmitting={isSubmittingVote}
            onVote={() => handleVote(matchup.park2.id, matchup.park1.id)}
          />
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-xl text-neutral-700 mb-4">No matchup available</p>
          <Button onClick={() => skipMatchup()}>Generate Matchup</Button>
        </div>
      )}

      <div className="mt-6 text-center">
        <Button 
          variant="link" 
          className="text-accent hover:text-accent/80"
          onClick={() => skipMatchup()}
          disabled={isSkippingMatchup}
        >
          {isSkippingMatchup ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading new matchup...
            </>
          ) : (
            <>
              Skip this matchup <ArrowRight className="ml-1 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </section>
  );
};

export default Matchup;
