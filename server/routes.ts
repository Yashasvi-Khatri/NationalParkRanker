import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertVoteSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  const apiRouter = express.Router();
  
  // Get all parks sorted by ELO rating
  apiRouter.get("/parks", async (req, res) => {
    try {
      const parks = await storage.getAllParks();
      // Sort by ELO rating in descending order
      parks.sort((a, b) => b.elo - a.elo);
      res.json(parks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch parks" });
    }
  });
  
  // Get a specific park by ID
  apiRouter.get("/parks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid park ID" });
      }
      
      const park = await storage.getParkById(id);
      if (!park) {
        return res.status(404).json({ error: "Park not found" });
      }
      
      res.json(park);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch park" });
    }
  });
  
  // Get current matchup
  apiRouter.get("/matchup", async (req, res) => {
    try {
      const matchup = await storage.getCurrentMatchup();
      if (!matchup) {
        // If no matchup exists, generate a new one
        const newMatchup = await storage.generateNewMatchup();
        return res.json(newMatchup);
      }
      res.json(matchup);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch matchup" });
    }
  });
  
  // Generate a new matchup
  apiRouter.post("/matchup", async (req, res) => {
    try {
      const newMatchup = await storage.generateNewMatchup();
      res.json(newMatchup);
    } catch (error) {
      res.status(500).json({ error: "Failed to generate new matchup" });
    }
  });
  
  // Submit a vote for a park in a matchup
  apiRouter.post("/vote", async (req, res) => {
    try {
      const voteSchema = z.object({
        winnerId: z.number(),
        loserId: z.number()
      });
      
      const parsedData = voteSchema.safeParse(req.body);
      if (!parsedData.success) {
        return res.status(400).json({ error: "Invalid vote data" });
      }
      
      const { winnerId, loserId } = parsedData.data;
      
      // Get parks
      const winner = await storage.getParkById(winnerId);
      const loser = await storage.getParkById(loserId);
      
      if (!winner || !loser) {
        return res.status(404).json({ error: "One or both parks not found" });
      }
      
      // Calculate new ELO ratings
      const expectedScoreWinner = 1 / (1 + Math.pow(10, (loser.elo - winner.elo) / 400));
      const expectedScoreLoser = 1 / (1 + Math.pow(10, (winner.elo - loser.elo) / 400));
      
      const kFactor = 32;
      const winnerEloChange = Math.round(kFactor * (1 - expectedScoreWinner));
      const loserEloChange = Math.round(kFactor * (0 - expectedScoreLoser));
      
      const newWinnerElo = winner.elo + winnerEloChange;
      const newLoserElo = loser.elo + loserEloChange;
      
      // Update park ELO ratings and win/loss records
      await storage.updatePark(winner.id, {
        elo: newWinnerElo,
        wins: winner.wins + 1
      });
      
      await storage.updatePark(loser.id, {
        elo: newLoserElo,
        losses: loser.losses + 1
      });
      
      // Record the vote
      const vote = await storage.createVote({
        winnerId,
        loserId,
        winnerEloChange,
        loserEloChange: Math.abs(loserEloChange) * -1
      });
      
      // Generate a new matchup
      const newMatchup = await storage.generateNewMatchup();
      
      res.json({
        vote,
        newMatchup
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to process vote" });
    }
  });
  
  // Get recent votes
  apiRouter.get("/votes/recent", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
      const recentVotes = await storage.getRecentVotes(limit);
      res.json(recentVotes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch recent votes" });
    }
  });
  
  // Use the API router
  app.use("/api", apiRouter);
  
  const httpServer = createServer(app);
  return httpServer;
}
