'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function SideBar() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  const publicApis = [
    { name: "Users", icon: "👥", color: "from-blue-500 to-blue-600" },
    { name: "Products", icon: "🛍️", color: "from-green-500 to-green-600" },
    { name: "Jokes", icon: "😄", color: "from-yellow-500 to-yellow-600" },
    { name: "Books", icon: "📚", color: "from-purple-500 to-purple-600" },
    { name: "Stocks", icon: "📈", color: "from-red-500 to-red-600" },
    { name: "Cats", icon: "🐱", color: "from-pink-500 to-pink-600" },
    { name: "Dogs", icon: "🐕", color: "from-orange-500 to-orange-600" },
    { name: "Meals", icon: "🍽️", color: "from-teal-500 to-teal-600" },
    { name: "Quotes", icon: "💭", color: "from-indigo-500 to-indigo-600" },
    { name: "Videos", icon: "🎥", color: "from-cyan-500 to-cyan-600" }
  ];

  const chatApp = [
    { name: "Chat", icon: "💬", color: "from-violet-500 to-fuchsia-600" }
  ];

  const renderMenuItem = (item) => {
    const isActive = pathname === `/${item.name.toLowerCase()}` || pathname.startsWith(`/${item.name.toLowerCase()}/`);
    return (
      <Link 
        key={item.name} 
        href={`/${item.name.toLowerCase()}`} 
        className={`group flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 hover:shadow-md hover:scale-[1.02] ${
          isActive 
            ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-2 border-blue-200 shadow-md scale-[1.02]' 
            : 'hover:bg-white'
        }`}
      >
        <div className={`w-10 h-10 bg-gradient-to-r ${item.color} rounded-lg flex items-center justify-center text-white shadow-sm group-hover:shadow-md transition-shadow ${
          isActive ? 'shadow-lg scale-110' : ''
        }`}>
          <span className="text-lg">{item.icon}</span>
        </div>
        <span className={`font-medium transition-colors ${
          isActive 
            ? 'text-blue-700 font-semibold' 
            : 'text-gray-700 group-hover:text-gray-900'
        }`}>
          {item.name}
        </span>
        {isActive && (
          <div className="ml-auto">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          </div>
        )}
      </Link>
    );
  };

  return (
    <div className="w-[280px] h-full bg-white/80 backdrop-blur-sm border-r border-gray-200 p-6 shadow-lg overflow-y-auto">
      {/* Public APIs Section */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-800 mb-2">📡 Public APIs</h2>
        <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded"></div>
      </div>
      
      <nav className="space-y-2">
        {publicApis.map(renderMenuItem)}
      </nav>

      {/* Divider */}
      <div className="my-6 border-t border-gray-200"></div>

      {/* Chat App Section */}
      <div className="mb-4">
        <h2 className="text-lg font-bold text-gray-800 mb-2">💬 Chat App</h2>
        <div className="w-12 h-1 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded"></div>
      </div>

      {isAuthenticated ? (
        <nav className="space-y-2">
          {chatApp.map(renderMenuItem)}
        </nav>
      ) : (
        <div className="bg-gradient-to-r from-violet-50 to-fuchsia-50 rounded-xl p-4 border border-violet-200">
          <p className="text-sm text-gray-600 mb-3">Login to access the Chat App</p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white px-4 py-2 rounded-lg font-medium transition-all"
          >
            🔐 Login to Chat
          </Link>
        </div>
      )}
      
      <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
        <div className="text-xs text-gray-600 mb-1">API Status</div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-gray-700">All Systems Operational</span>
        </div>
      </div>
    </div>
  );
}