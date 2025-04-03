import Hero from "@/components/Hero";
import Matchup from "@/components/Matchup";
import RankingsTable from "@/components/RankingsTable";
import RecentVotes from "@/components/RecentVotes";
import ParkExplorer from "@/components/ParkExplorer";

const Home = () => {
  return (
    <main className="container mx-auto px-4 py-8">
      <Hero />
      <Matchup />
      <RankingsTable limit={5} />
      <RecentVotes limit={4} />
      <ParkExplorer initialLimit={4} />
    </main>
  );
};

export default Home;
