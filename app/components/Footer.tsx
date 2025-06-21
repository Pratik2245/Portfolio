"use client";

import { Heart, ArrowUp } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-slate-900/80 backdrop-blur-sm border-t border-slate-700/50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <span className="text-gray-400">
              Made with <Heart className="inline h-4 w-4 text-red-500 mx-1" />
              by Pratik Paithankar
            </span>
          </div>

          <div className="flex items-center space-x-6">
            <span className="text-gray-400 text-sm">
              © 2024 All rights reserved
            </span>
            <button
              onClick={scrollToTop}
              className="p-2 bg-slate-800/50 rounded-full text-gray-400 hover:text-purple-400 hover:bg-slate-700/50 transition-all duration-300 transform hover:scale-110"
              aria-label="Scroll to top"
            >
              <ArrowUp className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
