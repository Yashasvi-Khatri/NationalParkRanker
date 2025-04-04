import RecentVotes from "@/components/RecentVotes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { useRankings } from "@/hooks/useRankings";
import { useVotes } from "@/hooks/useVotes";
import { ImageIcon } from "lucide-react";
import { useState, useCallback } from "react";
import { Park } from "@shared/schema";

// Default fallback images for when external images fail to load
const fallbackImages = [
  "https://images.unsplash.com/photo-1544979590-37e9b47eb705?w=600&h=400&fit=crop", // Tiger
  "https://images.unsplash.com/photo-1503656142023-618e7d1f435a?w=600&h=400&fit=crop", // Forest
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=400&fit=crop", // Nature
  "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=600&h=400&fit=crop", // Mountains
  "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=600&h=400&fit=crop", // Wildlife
];

// Get a deterministic fallback image based on park id
const getFallbackImage = (id: number) => {
  return fallbackImages[id % fallbackImages.length];
};

// Separate component for handling park avatar images with error handling
const ParkAvatar = ({ park }: { park: Park }) => {
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState(park.imageUrl);
  
  const handleImageError = useCallback(() => {
    if (!imageError) {
      setImageError(true);
      setImageSrc(getFallbackImage(park.id));
    }
  }, [imageError, park.id]);
  
  return (
    <>
      {imageError && imageSrc === getFallbackImage(park.id) ? (
        <div className="w-12 h-12 rounded-full bg-neutral-200 flex items-center justify-center mr-3">
          <ImageIcon className="w-6 h-6 text-neutral-400" />
        </div>
      ) : (
        <img 
          src={imageSrc} 
          alt={park.name} 
          className="w-12 h-12 rounded-full object-cover mr-3"
          onError={handleImageError}
        />
      )}
    </>
  );
};

const VoteHistory = () => {
  const { parks } = useRankings();
  const { votes } = useVotes(20);
  
  // Sample distribution data for visualization
  const COLORS = ['#2E7D32', '#FF9800', '#1976D2', '#9C27B0', '#E91E63'];
  
  // Create regional distribution data
  const regionData = [
    { name: 'North', value: 35 },
    { name: 'South', value: 25 },
    { name: 'East', value: 18 },
    { name: 'West', value: 14 },
    { name: 'Central', value: 8 },
  ];
  
  // Create vote distribution by day
  const votesByDay = [
    { name: 'Monday', value: 15 },
    { name: 'Tuesday', value: 18 },
    { name: 'Wednesday', value: 22 },
    { name: 'Thursday', value: 17 },
    { name: 'Friday', value: 28 },
  ];
  
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Voting History</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Votes</CardTitle>
            <CardDescription>All-time votes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {parks.reduce((acc, park) => acc + park.wins + park.losses, 0)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Most Voted Park</CardTitle>
            <CardDescription>Highest participation</CardDescription>
          </CardHeader>
          <CardContent>
            {parks.length > 0 ? (
              <div className="flex items-center">
                {/* Find park with most votes */}
                {(() => {
                  const parkWithMostVotes = [...parks].sort((a, b) => 
                    (b.wins + b.losses) - (a.wins + a.losses)
                  )[0];
                  
                  return (
                    <>
                      <ParkAvatar park={parkWithMostVotes} />
                      <div>
                        <div className="font-bold">{parkWithMostVotes.name}</div>
                        <div className="text-sm text-neutral-500">
                          {parkWithMostVotes.wins + parkWithMostVotes.losses} votes
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            ) : (
              <div>Loading...</div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Highest Win Rate</CardTitle>
            <CardDescription>Most successful park</CardDescription>
          </CardHeader>
          <CardContent>
            {parks.length > 0 ? (
              <div className="flex items-center">
                {/* Find park with highest win rate */}
                {(() => {
                  const parksWithVotes = parks.filter(p => p.wins + p.losses > 0);
                  const parkWithHighestWinRate = [...parksWithVotes].sort((a, b) => 
                    (b.wins / (b.wins + b.losses)) - (a.wins / (a.wins + a.losses))
                  )[0];
                  
                  return parkWithHighestWinRate ? (
                    <>
                      <ParkAvatar park={parkWithHighestWinRate} />
                      <div>
                        <div className="font-bold">{parkWithHighestWinRate.name}</div>
                        <div className="text-sm text-green-500">
                          {Math.round((parkWithHighestWinRate.wins / (parkWithHighestWinRate.wins + parkWithHighestWinRate.losses)) * 100)}% win rate
                        </div>
                      </div>
                    </>
                  ) : (
                    <div>No votes yet</div>
                  );
                })()}
              </div>
            ) : (
              <div>Loading...</div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="votes" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="votes">Recent Votes</TabsTrigger>
          <TabsTrigger value="stats">Voting Statistics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="votes">
          <RecentVotes limit={10} />
        </TabsContent>
        
        <TabsContent value="stats">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Regional Distribution</CardTitle>
                <CardDescription>Votes by geographical region</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={regionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {regionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Voting Activity</CardTitle>
                <CardDescription>Votes by day of the week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={votesByDay}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {votesByDay.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default VoteHistory;
