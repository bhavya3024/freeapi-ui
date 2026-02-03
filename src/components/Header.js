'use client';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user, isAuthenticated, logout, loading } = useAuth();

  return (
    <div className="flex justify-between items-center p-6 w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white shadow-lg">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
          <span className="text-sm font-bold">🚀</span>
        </div>
        <Link href="/" className="text-2xl font-bold tracking-tight hover:opacity-90 transition-opacity">
          FreeAPI Explorer
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        <div className="hidden md:flex items-center space-x-2 text-sm bg-white/10 px-3 py-1 rounded-full">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          <span>Live Data</span>
        </div>
        
        {!loading && (
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-2 bg-white/10 px-3 py-2 rounded-lg">
                  <div className="w-7 h-7 bg-gradient-to-br from-green-400 to-blue-400 rounded-full flex items-center justify-center text-sm font-bold">
                    {user?.username?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <span className="text-sm font-medium hidden sm:block">{user?.username}</span>
                </div>
                <button
                  onClick={logout}
                  className="text-sm bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="text-sm bg-white hover:bg-gray-100 text-purple-600 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}