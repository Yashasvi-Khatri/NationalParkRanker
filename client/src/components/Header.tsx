import { Link, useLocation } from "wouter";
import { MountainSnow } from "lucide-react";

const Header = () => {
  const [location] = useLocation();

  return (
    <header className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center mb-3 sm:mb-0">
          <MountainSnow className="h-6 w-6 mr-3" />
          <Link href="/">
            <a className="font-bold text-2xl">Indian Parks Ranking</a>
          </Link>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link href="/">
                <a className={`hover:text-accent transition-colors font-medium ${location === "/" ? "text-accent" : ""}`}>
                  Vote
                </a>
              </Link>
            </li>
            <li>
              <Link href="/rankings">
                <a className={`hover:text-accent transition-colors font-medium ${location === "/rankings" ? "text-accent" : ""}`}>
                  Rankings
                </a>
              </Link>
            </li>
            <li>
              <Link href="/history">
                <a className={`hover:text-accent transition-colors font-medium ${location === "/history" ? "text-accent" : ""}`}>
                  History
                </a>
              </Link>
            </li>
            <li>
              <Link href="/about">
                <a className={`hover:text-accent transition-colors font-medium ${location === "/about" ? "text-accent" : ""}`}>
                  About
                </a>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
