'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    router.push('/');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container flex justify-between items-center py-4">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          CleanHome
        </Link>

        <div className="flex gap-6 items-center">
          <Link href="/" className="text-gray-700 hover:text-blue-600">
            Home
          </Link>
          <Link href="/housekeepers" className="text-gray-700 hover:text-blue-600">
            Browse Housekeepers
          </Link>

          {isLoggedIn ? (
            <>
              <Link href="/dashboard" className="text-gray-700 hover:text-blue-600">
                Dashboard
              </Link>
              <Link href="/bookings" className="text-gray-700 hover:text-blue-600">
                My Bookings
              </Link>
              <div className="relative group">
                <button className="text-gray-700 hover:text-blue-600">
                  {user?.firstName || 'Account'} ▼
                </button>
                <div className="absolute hidden group-hover:block bg-white shadow-md rounded-lg p-2 right-0">
                  <Link href="/profile" className="block px-4 py-2 hover:bg-gray-100">
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-secondary">
                Login
              </Link>
              <Link href="/register" className="btn-primary">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
