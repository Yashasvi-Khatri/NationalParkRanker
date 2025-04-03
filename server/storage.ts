import { Park, InsertPark, Vote, InsertVote, Matchup, InsertMatchup, VoteWithParks, MatchupWithParks } from "@shared/schema";

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
    
    // Initialize with sample Indian national parks data
    this.initializeParks();
    // Create initial matchup
    this.generateNewMatchup();
  }
  
  private initializeParks(): void {
    const parksData: InsertPark[] = [
      {
        name: "Campbell Bay National Park",
        imageUrl: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=600&h=400&fit=crop",
        location: "Great Nicobar Island",
        formed: "1992",
        notableFeatures: "Part of Great Nicobar Biosphere Reserve",
        floraAndFauna: "Crab-eating macaque, Nicobar treeshrew",
        rivers: "Galathea River",
      },
      {
        name: "Jim Corbett National Park",
        imageUrl: "https://images.unsplash.com/photo-1541720553099-fd70c0e31fcd?w=600&h=400&fit=crop",
        location: "Uttarakhand",
        formed: "1936",
        notableFeatures: "Oldest national park in India",
        floraAndFauna: "Bengal tiger, Asian elephant, leopard",
        rivers: "Ramganga River",
      },
      {
        name: "Kaziranga National Park",
        imageUrl: "https://images.unsplash.com/photo-1591808216268-ce0b28e38fd5?w=600&h=400&fit=crop",
        location: "Assam",
        formed: "1974",
        notableFeatures: "UNESCO World Heritage Site",
        floraAndFauna: "One-horned rhinoceros, tiger, elephant",
        rivers: "Brahmaputra River",
      },
      {
        name: "Bandipur National Park",
        imageUrl: "https://images.unsplash.com/photo-1585938389612-a552a28d6914?w=600&h=400&fit=crop",
        location: "Karnataka",
        formed: "1974",
        notableFeatures: "Part of Nilgiri Biosphere Reserve",
        floraAndFauna: "Indian elephant, gaur, tiger, sloth bear",
        rivers: "Kabini River",
      },
      {
        name: "Ranthambore National Park",
        imageUrl: "https://images.unsplash.com/photo-1602425795147-96a56c7884b1?w=600&h=400&fit=crop",
        location: "Rajasthan",
        formed: "1980",
        notableFeatures: "Famous for tiger sightings",
        floraAndFauna: "Bengal tiger, leopard, nilgai",
        rivers: "Chambal and Banas rivers",
      },
      {
        name: "Kanha National Park",
        imageUrl: "https://images.unsplash.com/photo-1575624238938-1261eecedc65?w=600&h=400&fit=crop",
        location: "Madhya Pradesh",
        formed: "1955",
        notableFeatures: "Inspiration for Kipling's 'The Jungle Book'",
        floraAndFauna: "Tiger, leopard, sloth bear, barasingha",
        rivers: "Banjar River",
      },
      {
        name: "Periyar National Park",
        imageUrl: "https://images.unsplash.com/photo-1551918120-9739cb430c6d?w=600&h=400&fit=crop",
        location: "Kerala",
        formed: "1982",
        notableFeatures: "Tiger reserve with artificial lake",
        floraAndFauna: "Elephant, tiger, gaur, sambar deer",
        rivers: "Periyar River",
      },
      {
        name: "Sundarbans National Park",
        imageUrl: "https://images.unsplash.com/photo-1600254528608-2f0bd6138e9b?w=600&h=400&fit=crop",
        location: "West Bengal",
        formed: "1984",
        notableFeatures: "UNESCO World Heritage Site, largest mangrove forest",
        floraAndFauna: "Royal Bengal tiger, saltwater crocodile",
        rivers: "Ganges Delta",
      },
      {
        name: "Gir National Park",
        imageUrl: "https://images.unsplash.com/photo-1578326457399-3b34dbbf23b8?w=600&h=400&fit=crop",
        location: "Gujarat",
        formed: "1965",
        notableFeatures: "Only natural habitat of Asiatic lions",
        floraAndFauna: "Asiatic lion, leopard, sambar deer",
        rivers: "Hiran River",
      },
      {
        name: "Valley of Flowers National Park",
        imageUrl: "https://images.unsplash.com/photo-1566141863735-7e40bd8a8ecd?w=600&h=400&fit=crop",
        location: "Uttarakhand",
        formed: "1982",
        notableFeatures: "UNESCO World Heritage Site, alpine valley",
        floraAndFauna: "Rare flowers, blue sheep, snow leopard",
        rivers: "Pushpawati River",
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
