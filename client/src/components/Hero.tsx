import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Park } from "@shared/schema";

const Hero = () => {
  const { data: parks } = useQuery<Park[]>({
    queryKey: ["/api/parks"],
  });

  const totalParks = parks?.length || 0;
  const totalVotes = parks?.reduce((acc, park) => acc + park.wins + park.losses, 0) || 0;

  return (
    <section className="mb-12">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="relative h-48 sm:h-64 md:h-80 bg-gray-200">
          <img
            src="https://images.unsplash.com/photo-1551877340-58fda212ee96?w=1200&h=400&fit=crop"
            alt="Indian National Parks"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-neutral-900/70 flex items-end">
            <div className="p-6 text-white">
              <h2 className="font-bold text-2xl md:text-3xl">Discover India's Natural Treasures</h2>
              <p className="mt-2">Vote for your favorite national parks and help create the ultimate ranking</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div>
              <p className="text-neutral-700 mb-2">
                Currently <span className="font-semibold text-primary">{totalVotes} votes</span> across{" "}
                <span className="font-semibold text-primary">{totalParks} parks</span>
              </p>
              <p className="text-sm text-neutral-500">Last updated: {new Date().toLocaleDateString()}</p>
            </div>
            <Link href="/#current-matchup">
              <Button className="mt-4 sm:mt-0 bg-primary hover:bg-primary/90 rounded-full">
                Cast Your Vote Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
