'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token) {
      router.push('/login');
      return;
    }

    if (userData) {
      setUser(JSON.parse(userData));
    }

    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setUser(response.data);
    } catch (err) {
      console.error('Failed to fetch user data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container py-12 text-center">Loading dashboard...</div>;
  }

  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* User Info */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">Welcome, {user?.first_name}!</h2>
          <div className="space-y-2">
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Role:</strong> {user?.role === 'housekeeper' ? 'Housekeeper' : 'Customer'}</p>
            <p><strong>Phone:</strong> {user?.phone || 'Not set'}</p>
            {user?.rating && (
              <p><strong>Rating:</strong> ⭐ {user.rating}</p>
            )}
          </div>
          <Link href="/profile" className="btn-primary inline-block mt-4">
            Edit Profile
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link href="/housekeepers" className="btn-primary block text-center">
              Browse Housekeepers
            </Link>
            <Link href="/bookings" className="btn-secondary block text-center">
              My Bookings
            </Link>
            {user?.role === 'housekeeper' && (
              <Link href="/services" className="btn-secondary block text-center">
                Manage Services
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Latest Bookings */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">Recent Bookings</h2>
        <p className="text-gray-600">
          Go to{' '}
          <Link href="/bookings" className="text-blue-600 hover:underline">
            My Bookings
          </Link>
          {' '}to view all your bookings
        </p>
      </div>
    </div>
  );
}
