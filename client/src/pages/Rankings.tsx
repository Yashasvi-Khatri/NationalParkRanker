import RankingsTable from "@/components/RankingsTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useRankings } from "@/hooks/useRankings";

const Rankings = () => {
  const { parks } = useRankings();
  
  // Sample ELO history data for top 5 parks (in real app, this would come from backend)
  const eloHistoryData = [
    { name: "Week 1", park1: 1512, park2: 1505, park3: 1498, park4: 1490, park5: 1485 },
    { name: "Week 2", park1: 1535, park2: 1520, park3: 1506, park4: 1496, park5: 1478 },
    { name: "Week 3", park1: 1560, park2: 1545, park3: 1515, park4: 1505, park5: 1490 },
    { name: "Week 4", park1: 1588, park2: 1562, park3: 1538, park4: 1510, park5: 1504 },
    { name: "Week 5", park1: 1610, park2: 1586, park3: 1545, park4: 1522, park5: 1515 },
    { name: "Week 6", park1: 1632, park2: 1598, park3: 1558, park4: 1535, park5: 1528 },
  ];
  
  // Stats cards data
  const topPark = parks[0];
  const mostImproved = parks[2]; // For demonstration
  const totalVotes = parks.reduce((acc, park) => acc + park.wins + park.losses, 0);
  
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">National Parks Rankings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Top Ranked Park</CardTitle>
            <CardDescription>Current leader</CardDescription>
          </CardHeader>
          <CardContent>
            {topPark ? (
              <div className="flex items-center">
                <img src={topPark.imageUrl} alt={topPark.name} className="w-12 h-12 rounded-full object-cover mr-3" />
                <div>
                  <div className="font-bold">{topPark.name}</div>
                  <div className="text-sm text-neutral-500">ELO: {topPark.elo}</div>
                </div>
              </div>
            ) : (
              <div>Loading...</div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Most Improved</CardTitle>
            <CardDescription>Biggest ELO gain</CardDescription>
          </CardHeader>
          <CardContent>
            {mostImproved ? (
              <div className="flex items-center">
                <img src={mostImproved.imageUrl} alt={mostImproved.name} className="w-12 h-12 rounded-full object-cover mr-3" />
                <div>
                  <div className="font-bold">{mostImproved.name}</div>
                  <div className="text-sm text-green-500">+{Math.floor(Math.random() * 50) + 10} points</div>
                </div>
              </div>
            ) : (
              <div>Loading...</div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Votes</CardTitle>
            <CardDescription>Community participation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalVotes}</div>
            <div className="text-sm text-neutral-500">across {parks.length} parks</div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>ELO Rating Trends</CardTitle>
          <CardDescription>Last 6 weeks performance of top 5 parks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={eloHistoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={['dataMin - 20', 'dataMax + 20']} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="park1" stroke="#2E7D32" name={parks[0]?.name || "Park 1"} strokeWidth={2} />
                <Line type="monotone" dataKey="park2" stroke="#1976D2" name={parks[1]?.name || "Park 2"} strokeWidth={2} />
                <Line type="monotone" dataKey="park3" stroke="#FF9800" name={parks[2]?.name || "Park 3"} strokeWidth={2} />
                <Line type="monotone" dataKey="park4" stroke="#9C27B0" name={parks[3]?.name || "Park 4"} strokeWidth={2} />
                <Line type="monotone" dataKey="park5" stroke="#E91E63" name={parks[4]?.name || "Park 5"} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <RankingsTable showViewMore={false} />
    </main>
  );
};

export default Rankings;
