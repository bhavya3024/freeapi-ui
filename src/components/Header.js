export default function Header() {
  return (
    <div className="flex justify-between items-center p-6 w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white shadow-lg">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
          <span className="text-sm font-bold">🚀</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">FreeAPI Explorer</h1>
      </div>
      <div className="flex items-center space-x-4">
        <div className="hidden md:flex items-center space-x-2 text-sm bg-white/10 px-3 py-1 rounded-full">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          <span>Live Data</span>
        </div>
      </div>
    </div>
  );
}