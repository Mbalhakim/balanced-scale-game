import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -top-48 -left-48"></div>
        <div className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -bottom-48 -right-48"></div>
      </div>

      <div className="relative z-10 text-center space-y-8 px-4">
        {/* Title with gradient text */}
        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
          Balanced Scale
        </h1>
        
        {/* Subtitle with animated border */}
        <div className="relative inline-block">
          <div className="absolute inset-0 border-2 border-purple-400/50 rounded-full animate-pulse"></div>
          <h2 className="text-2xl md:text-3xl text-gray-300 px-8 py-2 relative">
            Will you survive the game?
          </h2>
        </div>

        {/* Enter button with hover effects */}
        <Link href="/multiplayer">
          <button className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-300 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:rounded-lg hover:shadow-2xl hover:shadow-purple-500/30 transform hover:-translate-y-1">
            <span>Enter Game Lobby</span>
            <svg 
              className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M17 8l4 4m0 0l-4 4m4-4H3" 
              />
            </svg>
          </button>
        </Link>

        {/* Warning text */}
        <p className="text-red-400/80 text-sm mt-6 max-w-md mx-auto">
          Warning: This game contains intense psychological challenges. 
          Players are eliminated for incorrect choices. Proceed with caution.
        </p>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 text-gray-500 text-sm">
        <p>Based on the Alice in Borderland universe</p>
      </div>
    </div>
  );
}