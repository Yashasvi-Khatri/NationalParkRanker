/**
 * Calculates the expected score of a player based on the ELO rating system.
 * 
 * @param playerRating The ELO rating of the player
 * @param opponentRating The ELO rating of the opponent
 * @returns The expected score (between 0 and 1)
 */
export function calculateExpectedScore(playerRating: number, opponentRating: number): number {
  return 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
}

/**
 * Calculates the new ELO rating based on the outcome of a match.
 * 
 * @param currentRating The current ELO rating
 * @param expectedScore The expected score (calculated using calculateExpectedScore)
 * @param actualScore The actual score (1 for win, 0 for loss, 0.5 for draw)
 * @param kFactor The K-factor to use (determines how much ratings can change)
 * @returns The new ELO rating
 */
export function calculateNewRating(
  currentRating: number,
  expectedScore: number,
  actualScore: number,
  kFactor: number = 32
): number {
  return Math.round(currentRating + kFactor * (actualScore - expectedScore));
}

/**
 * Calculates the ELO rating change for both players in a match.
 * 
 * @param winnerRating The winner's current ELO rating
 * @param loserRating The loser's current ELO rating
 * @param kFactor The K-factor to use (default: 32)
 * @returns An object with the new ratings and rating changes
 */
export function calculateMatchResult(
  winnerRating: number,
  loserRating: number,
  kFactor: number = 32
): {
  winnerNewRating: number;
  loserNewRating: number;
  winnerRatingChange: number;
  loserRatingChange: number;
} {
  const expectedScoreWinner = calculateExpectedScore(winnerRating, loserRating);
  const expectedScoreLoser = calculateExpectedScore(loserRating, winnerRating);
  
  const winnerNewRating = calculateNewRating(winnerRating, expectedScoreWinner, 1, kFactor);
  const loserNewRating = calculateNewRating(loserRating, expectedScoreLoser, 0, kFactor);
  
  return {
    winnerNewRating,
    loserNewRating,
    winnerRatingChange: winnerNewRating - winnerRating,
    loserRatingChange: loserNewRating - loserRating
  };
}
