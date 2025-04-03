import { Park } from "@shared/schema";
import { useRankings } from "@/hooks/useRankings";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { Link } from "wouter";

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

  const getTrendIcon = (park: Park & { rank: number }) => {
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
  };

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
                <tr key={park.id} className="hover:bg-neutral-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{park.rank}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 rounded overflow-hidden mr-3">
                        <img src={park.imageUrl} alt={park.name} className="h-full w-full object-cover" />
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
                    {getTrendIcon(park)}
                    <span className="ml-1">{Math.floor(Math.random() * 5)}</span>
                  </td>
                </tr>
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
