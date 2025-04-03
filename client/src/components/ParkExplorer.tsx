import { useRankings } from "@/hooks/useRankings";
import ParkCard from "@/components/ParkCard";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

const ParkExplorerSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
          <Skeleton className="h-40 w-full" />
          <div className="p-4">
            <Skeleton className="h-5 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-2" />
            <Skeleton className="h-3 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
};

interface ParkExplorerProps {
  initialLimit?: number;
  showSearch?: boolean;
}

const ParkExplorer = ({ initialLimit = 4, showSearch = true }: ParkExplorerProps) => {
  const { parks, isLoading } = useRankings();
  const [searchQuery, setSearchQuery] = useState("");
  const [limit, setLimit] = useState(initialLimit);

  const filteredParks = searchQuery 
    ? parks.filter(park => 
        park.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        park.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : parks;

  const displayedParks = filteredParks.slice(0, limit);
  const hasMore = limit < filteredParks.length;

  const loadMore = () => {
    setLimit(prev => prev + 4);
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-bold text-2xl">Explore All Parks</h2>
        {showSearch && (
          <div className="flex">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search parks..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-neutral-500" />
              </div>
            </div>
          </div>
        )}
      </div>
      
      {isLoading ? (
        <ParkExplorerSkeleton />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {displayedParks.map(park => (
              <ParkCard key={park.id} park={park} />
            ))}
          </div>
          
          {hasMore && (
            <div className="mt-6 text-center">
              <Button 
                variant="outline" 
                className="bg-white text-primary hover:bg-primary hover:text-white border border-primary rounded-full"
                onClick={loadMore}
              >
                Load More Parks
              </Button>
            </div>
          )}

          {displayedParks.length === 0 && (
            <div className="text-center py-12 text-neutral-500">
              No parks found matching your search.
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default ParkExplorer;
