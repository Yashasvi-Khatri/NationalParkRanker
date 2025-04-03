import { useQuery } from "@tanstack/react-query";
import { VoteWithParks } from "@shared/schema";

export function useVotes(limit: number = 5) {
  const { data: votes, isLoading, error } = useQuery<VoteWithParks[]>({
    queryKey: ["/api/votes/recent", limit],
  });

  return {
    votes,
    isLoading,
    error,
  };
}
