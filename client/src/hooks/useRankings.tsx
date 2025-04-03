import { useQuery } from "@tanstack/react-query";
import { Park } from "@shared/schema";
import { useState } from "react";

type SortOption = "elo" | "name" | "votes";

export function useRankings() {
  const [sortOption, setSortOption] = useState<SortOption>("elo");

  const { data: parks, isLoading, error } = useQuery<Park[]>({
    queryKey: ["/api/parks"],
  });

  const sortedParks = parks
    ? [...parks].sort((a, b) => {
        switch (sortOption) {
          case "elo":
            return b.elo - a.elo;
          case "name":
            return a.name.localeCompare(b.name);
          case "votes":
            const aVotes = a.wins + a.losses;
            const bVotes = b.wins + b.losses;
            return bVotes - aVotes;
          default:
            return 0;
        }
      })
    : [];

  // Add rank property to the parks based on ELO
  const rankedParks = sortedParks.map((park, index) => ({
    ...park,
    rank: index + 1,
    winRate: park.wins + park.losses > 0 ? Math.round((park.wins / (park.wins + park.losses)) * 100) : 0,
  }));

  return {
    parks: rankedParks,
    isLoading,
    error,
    sortOption,
    setSortOption,
  };
}
