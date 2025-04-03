import { Link, useLocation } from "wouter";
import { MountainSnow } from "lucide-react";

const Header = () => {
  const [location] = useLocation();

  return (
    <header className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center mb-3 sm:mb-0">
          <MountainSnow className="h-6 w-6 mr-3" />
          <Link href="/" className="font-bold text-2xl">
            Indian Parks Ranking
          </Link>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link href="/" className={`hover:text-accent transition-colors font-medium ${location === "/" ? "text-accent" : ""}`}>
                Vote
              </Link>
            </li>
            <li>
              <Link href="/rankings" className={`hover:text-accent transition-colors font-medium ${location === "/rankings" ? "text-accent" : ""}`}>
                Rankings
              </Link>
            </li>
            <li>
              <Link href="/history" className={`hover:text-accent transition-colors font-medium ${location === "/history" ? "text-accent" : ""}`}>
                History
              </Link>
            </li>
            <li>
              <Link href="/about" className={`hover:text-accent transition-colors font-medium ${location === "/about" ? "text-accent" : ""}`}>
                About
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
