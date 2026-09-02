'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';

export default function Housekeepers() {
  const [housekeepers, setHousekeepers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHousekeepers();
  }, []);

  const fetchHousekeepers = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/all`
      );
      setHousekeepers(response.data);
    } catch (err) {
      setError('Failed to load housekeepers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container py-12 text-center">Loading housekeepers...</div>;
  }

  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-2">Browse Housekeepers</h1>
      <p className="text-gray-600 mb-8">Find and book trusted housekeepers for your home</p>

      {error && <div className="alert-error">{error}</div>}

      {housekeepers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No housekeepers available yet</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {housekeepers.map((housekeeper) => (
            <div key={housekeeper.id} className="card hover:shadow-lg transition">
              <div className="mb-4">
                {housekeeper.profile_picture_url && (
                  <img
                    src={housekeeper.profile_picture_url}
                    alt={housekeeper.first_name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                <h3 className="text-xl font-bold">
                  {housekeeper.first_name} {housekeeper.last_name}
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-yellow-500">⭐</span>
                  <span className="font-semibold">{housekeeper.rating || 0}</span>
                  <span className="text-gray-600">({housekeeper.total_reviews || 0} reviews)</span>
                </div>
              </div>

              {housekeeper.bio && (
                <p className="text-gray-600 text-sm mb-4">{housekeeper.bio}</p>
              )}

              <Link
                href={`/book/${housekeeper.id}`}
                className="btn-primary block text-center"
              >
                View Services & Book
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
