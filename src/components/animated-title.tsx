export function AnimatedTitle() {
  return (
    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white animate-fade-in">
      Find Your Perfect <span className="text-blue-400">Wind</span>
    </h1>
  )
}

// Add this to your globals.css or create a new animation in your Tailwind config
// @keyframes fadeIn {
//   from { opacity: 0; transform: translateY(20px); }
//   to { opacity: 1; transform: translateY(0); }
// } 