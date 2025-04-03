import { pgTable, text, serial, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Park model
export const parks = pgTable("parks", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  imageUrl: text("image_url").notNull(),
  location: text("location").notNull(),
  formed: text("formed"),
  notableFeatures: text("notable_features"),
  floraAndFauna: text("flora_and_fauna"),
  rivers: text("rivers"),
  elo: integer("elo").notNull().default(1500),
  wins: integer("wins").notNull().default(0),
  losses: integer("losses").notNull().default(0),
  draws: integer("draws").notNull().default(0),
});

export const insertParkSchema = createInsertSchema(parks).omit({
  id: true,
  elo: true,
  wins: true,
  losses: true,
  draws: true,
});

// Vote model for tracking voting history
export const votes = pgTable("votes", {
  id: serial("id").primaryKey(),
  winnerId: integer("winner_id").notNull(),
  loserId: integer("loser_id").notNull(),
  winnerEloChange: integer("winner_elo_change").notNull(),
  loserEloChange: integer("loser_elo_change").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertVoteSchema = createInsertSchema(votes).omit({
  id: true,
  timestamp: true,
});

// Matchup model for tracking current matchups
export const matchups = pgTable("matchups", {
  id: serial("id").primaryKey(),
  parkId1: integer("park_id_1").notNull(),
  parkId2: integer("park_id_2").notNull(),
});

export const insertMatchupSchema = createInsertSchema(matchups).omit({
  id: true,
});

// Type definitions
export type Park = typeof parks.$inferSelect;
export type InsertPark = z.infer<typeof insertParkSchema>;

export type Vote = typeof votes.$inferSelect;
export type InsertVote = z.infer<typeof insertVoteSchema>;

export type Matchup = typeof matchups.$inferSelect;
export type InsertMatchup = z.infer<typeof insertMatchupSchema>;

// Extended type for matchups with park details
export type MatchupWithParks = {
  id: number;
  park1: Park;
  park2: Park;
};

// Extended type for votes with park details
export type VoteWithParks = {
  id: number;
  winner: Park;
  loser: Park;
  winnerEloChange: number;
  loserEloChange: number;
  timestamp: Date;
};
