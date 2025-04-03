import { MountainSnow, Twitter, Facebook, Instagram, Youtube } from "lucide-react";
import { Link } from "wouter";

const Footer = () => {
  return (
    <footer className="bg-primary text-white mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4 flex items-center">
              <MountainSnow className="h-5 w-5 mr-2" />
              Indian Parks Ranking
            </h3>
            <p className="text-sm text-white/80">
              Discover and rank the beauty and biodiversity of India's national parks through community voting.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <a className="text-sm text-white/80 hover:text-white transition-colors">Home</a>
                </Link>
              </li>
              <li>
                <Link href="/rankings">
                  <a className="text-sm text-white/80 hover:text-white transition-colors">Rankings</a>
                </Link>
              </li>
              <li>
                <Link href="/history">
                  <a className="text-sm text-white/80 hover:text-white transition-colors">Vote History</a>
                </Link>
              </li>
              <li>
                <Link href="/about">
                  <a className="text-sm text-white/80 hover:text-white transition-colors">About ELO System</a>
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a href="https://en.wikipedia.org/wiki/List_of_national_parks_of_India" target="_blank" rel="noopener noreferrer" className="text-sm text-white/80 hover:text-white transition-colors">
                  National Parks of India
                </a>
              </li>
              <li>
                <a href="https://www.wildlife-conservation.org/" target="_blank" rel="noopener noreferrer" className="text-sm text-white/80 hover:text-white transition-colors">
                  Wildlife Conservation
                </a>
              </li>
              <li>
                <a href="https://www.incredibleindia.org/content/incredible-india-v2/en.html" target="_blank" rel="noopener noreferrer" className="text-sm text-white/80 hover:text-white transition-colors">
                  Travel Information
                </a>
              </li>
              <li>
                <a href="https://www.indiabio.org/" target="_blank" rel="noopener noreferrer" className="text-sm text-white/80 hover:text-white transition-colors">
                  Biodiversity Data
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Stay Connected</h4>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="text-white/80 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
            <p className="text-sm text-white/80">
              Subscribe for updates on new parks and rankings.
            </p>
          </div>
        </div>
        <div className="border-t border-white/20 mt-8 pt-8 text-center text-sm text-white/60">
          <p>&copy; {new Date().getFullYear()} Indian Parks Ranking. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
