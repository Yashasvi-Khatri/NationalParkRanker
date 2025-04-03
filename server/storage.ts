import { Park, InsertPark, Vote, InsertVote, Matchup, InsertMatchup, VoteWithParks, MatchupWithParks } from "@shared/schema";
import fs from 'fs';
import path from 'path';

export interface IStorage {
  // Parks
  getAllParks(): Promise<Park[]>;
  getParkById(id: number): Promise<Park | undefined>;
  createPark(park: InsertPark): Promise<Park>;
  updatePark(id: number, parkData: Partial<Park>): Promise<Park | undefined>;
  
  // Votes
  getAllVotes(): Promise<Vote[]>;
  getRecentVotes(limit: number): Promise<VoteWithParks[]>;
  createVote(vote: InsertVote): Promise<Vote>;
  
  // Matchups
  getCurrentMatchup(): Promise<MatchupWithParks | undefined>;
  createMatchup(matchup: InsertMatchup): Promise<Matchup>;
  generateNewMatchup(): Promise<MatchupWithParks>;
}

export class MemStorage implements IStorage {
  private parks: Map<number, Park>;
  private votes: Map<number, Vote>;
  private matchups: Map<number, Matchup>;
  private parkIdCounter: number;
  private voteIdCounter: number;
  private matchupIdCounter: number;
  
  constructor() {
    this.parks = new Map();
    this.votes = new Map();
    this.matchups = new Map();
    this.parkIdCounter = 1;
    this.voteIdCounter = 1;
    this.matchupIdCounter = 1;
    
    // Initialize with Indian national parks data from JSON file
    this.initializeParks();
    // Create initial matchup
    this.generateNewMatchup();
  }
  
  private initializeParks(): void {
    try {
      // Load parks from JSON file
      const jsonPath = path.join(process.cwd(), 'server', 'data', 'parks.json');
      const parksJson = fs.readFileSync(jsonPath, 'utf8');
      const parksData = JSON.parse(parksJson);
      
      console.log(`Loaded ${parksData.length} parks from JSON file`);
      
      // Map JSON data to Park objects and add to storage
      parksData.forEach((park: any) => {
        // Convert park to our schema format
        const newPark: Park = {
          id: park.id,
          name: park.name,
          imageUrl: park.imageUrl,
          location: park.location,
          formed: park.formed || "",
          notableFeatures: park.notableFeatures || "",
          floraAndFauna: park.floraAndFauna || "",
          rivers: "",  // Our JSON doesn't have rivers field
          elo: park.elo || 1500,
          wins: park.wins || 0,
          losses: park.losses || 0,
          draws: 0  // Our JSON doesn't have draws field
        };
        
        this.parks.set(park.id, newPark);
        
        // Update counter to be higher than any existing id
        if (park.id >= this.parkIdCounter) {
          this.parkIdCounter = park.id + 1;
        }
      });
      
      console.log(`Initialized memory storage with ${this.parks.size} parks`);
    } catch (error) {
      console.error("Error loading parks from JSON:", error);
      // Fallback to hardcoded parks if JSON loading fails
      this.initializeFallbackParks();
    }
  }
  
  private initializeFallbackParks(): void {
    console.log("Using fallback parks data");
    const parksData: InsertPark[] = [
      {
        name: "Jim Corbett National Park",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Tiger_in_Corbett_National_Park.jpg/640px-Tiger_in_Corbett_National_Park.jpg",
        location: "Uttarakhand",
        formed: "1936",
        notableFeatures: "Tigers, elephants, leopards",
        floraAndFauna: "Bengal tiger, Asian elephant, leopard",
        rivers: "Ramganga River",
      },
      {
        name: "Ranthambore National Park",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Ranthambhore_Tiger.jpg/640px-Ranthambhore_Tiger.jpg",
        location: "Rajasthan",
        formed: "1980",
        notableFeatures: "Tigers, ancient ruins",
        floraAndFauna: "Bengal tiger, leopard, nilgai",
        rivers: "Chambal and Banas rivers",
      }
    ];
    
    parksData.forEach(park => {
      this.createPark(park);
    });
  }
  
  // Park methods
  async getAllParks(): Promise<Park[]> {
    return Array.from(this.parks.values());
  }
  
  async getParkById(id: number): Promise<Park | undefined> {
    return this.parks.get(id);
  }
  
  async createPark(park: InsertPark): Promise<Park> {
    const id = this.parkIdCounter++;
    const newPark: Park = {
      ...park,
      id,
      elo: 1500,
      wins: 0,
      losses: 0,
      draws: 0
    };
    this.parks.set(id, newPark);
    return newPark;
  }
  
  async updatePark(id: number, parkData: Partial<Park>): Promise<Park | undefined> {
    const park = this.parks.get(id);
    if (!park) return undefined;
    
    const updatedPark: Park = { ...park, ...parkData };
    this.parks.set(id, updatedPark);
    return updatedPark;
  }
  
  // Vote methods
  async getAllVotes(): Promise<Vote[]> {
    return Array.from(this.votes.values());
  }
  
  async getRecentVotes(limit: number): Promise<VoteWithParks[]> {
    const allVotes = Array.from(this.votes.values())
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
    
    return Promise.all(
      allVotes.map(async (vote) => {
        const winner = await this.getParkById(vote.winnerId);
        const loser = await this.getParkById(vote.loserId);
        
        if (!winner || !loser) {
          throw new Error(`Park not found for vote ${vote.id}`);
        }
        
        return {
          id: vote.id,
          winner,
          loser,
          winnerEloChange: vote.winnerEloChange,
          loserEloChange: vote.loserEloChange,
          timestamp: vote.timestamp
        };
      })
    );
  }
  
  async createVote(vote: InsertVote): Promise<Vote> {
    const id = this.voteIdCounter++;
    const newVote: Vote = {
      ...vote,
      id,
      timestamp: new Date()
    };
    this.votes.set(id, newVote);
    return newVote;
  }
  
  // Matchup methods
  async getCurrentMatchup(): Promise<MatchupWithParks | undefined> {
    const matchups = Array.from(this.matchups.values());
    if (matchups.length === 0) return undefined;
    
    const latestMatchup = matchups[matchups.length - 1];
    const park1 = await this.getParkById(latestMatchup.parkId1);
    const park2 = await this.getParkById(latestMatchup.parkId2);
    
    if (!park1 || !park2) return undefined;
    
    return {
      id: latestMatchup.id,
      park1,
      park2
    };
  }
  
  async createMatchup(matchup: InsertMatchup): Promise<Matchup> {
    const id = this.matchupIdCounter++;
    const newMatchup: Matchup = {
      ...matchup,
      id
    };
    this.matchups.set(id, newMatchup);
    return newMatchup;
  }
  
  async generateNewMatchup(): Promise<MatchupWithParks> {
    const parks = await this.getAllParks();
    if (parks.length < 2) {
      throw new Error("Not enough parks to create a matchup");
    }
    
    // Select two random parks for the matchup
    const shuffled = [...parks].sort(() => 0.5 - Math.random());
    const [park1, park2] = shuffled.slice(0, 2);
    
    const matchup = await this.createMatchup({
      parkId1: park1.id,
      parkId2: park2.id
    });
    
    return {
      id: matchup.id,
      park1,
      park2
    };
  }
}

export const storage = new MemStorage();
