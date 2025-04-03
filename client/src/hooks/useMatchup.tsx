import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { MatchupWithParks } from "@shared/schema";

export function useMatchup() {
  const { toast } = useToast();

  const { data: matchup, isLoading, error } = useQuery<MatchupWithParks>({
    queryKey: ["/api/matchup"],
  });

  const submitVoteMutation = useMutation({
    mutationFn: async ({ winnerId, loserId }: { winnerId: number; loserId: number }) => {
      const res = await apiRequest("POST", "/api/vote", { winnerId, loserId });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Vote submitted!",
        description: "Your vote has been recorded and a new matchup is ready.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/matchup"] });
      queryClient.invalidateQueries({ queryKey: ["/api/parks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/votes/recent"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to submit vote: ${error}`,
        variant: "destructive",
      });
    },
  });

  const skipMatchupMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/matchup", {});
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Matchup skipped",
        description: "A new matchup has been generated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/matchup"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to skip matchup: ${error}`,
        variant: "destructive",
      });
    },
  });

  return {
    matchup,
    isLoading,
    error,
    submitVote: submitVoteMutation.mutate,
    isSubmittingVote: submitVoteMutation.isPending,
    skipMatchup: skipMatchupMutation.mutate,
    isSkippingMatchup: skipMatchupMutation.isPending,
  };
}
