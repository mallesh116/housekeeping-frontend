'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';

export default function Book() {
  const params = useParams();
  const housekeeperId = params.id;
  const router = useRouter();
  const [housekeeper, setHousekeeper] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  const [bookingData, setBookingData] = useState({
    bookingDate: '',
    startTime: '09:00',
    endTime: '11:00',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchHousekeeperDetails();
  }, [housekeeperId]);

  const fetchHousekeeperDetails = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/housekeeper/${housekeeperId}/services`
      );
      setHousekeeper(response.data.housekeeper);
      setServices(response.data.services);
      if (response.data.services.length > 0) {
        setSelectedService(response.data.services[0].id);
      }
    } catch (err) {
      setError('Failed to load housekeeper details');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bookings`,
        {
          housekeeperId,
          serviceId: selectedService,
          bookingDate: bookingData.bookingDate,
          startTime: bookingData.startTime,
          endTime: bookingData.endTime,
          notes: bookingData.notes
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      router.push(`/bookings/${response.data.bookingId}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="container py-12 text-center">Loading...</div>;
  }

  if (!housekeeper) {
    return <div className="container py-12 text-center text-red-600">Housekeeper not found</div>;
  }

  return (
    <div className="container py-12">
      <div className="grid md:grid-cols-3 gap-8">
        {/* Housekeeper Info */}
        <div className="md:col-span-1">
          <div className="card sticky top-4">
            {housekeeper.profile_picture_url && (
              <img
                src={housekeeper.profile_picture_url}
                alt={housekeeper.first_name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}
            <h2 className="text-2xl font-bold mb-2">
              {housekeeper.first_name} {housekeeper.last_name}
            </h2>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-yellow-500">⭐</span>
              <span className="font-semibold">{housekeeper.rating || 0}</span>
              <span className="text-gray-600">({housekeeper.total_reviews || 0} reviews)</span>
            </div>
            {housekeeper.bio && (
              <p className="text-gray-600 text-sm">{housekeeper.bio}</p>
            )}
          </div>
        </div>

        {/* Booking Form */}
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-6">Book a Service</h1>

          {error && <div className="alert-error">{error}</div>}

          <form onSubmit={handleSubmit} className="card">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Service
              </label>
              <select
                value={selectedService || ''}
                onChange={(e) => setSelectedService(e.target.value)}
                className="input-field"
              >
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.title} - ${service.price_per_hour}/hour
                  </option>
                ))}
              </select>
              {selectedService && (
                <p className="text-gray-600 text-sm mt-2">
                  {services.find(s => s.id === selectedService)?.description}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                name="bookingDate"
                value={bookingData.bookingDate}
                onChange={handleInputChange}
                className="input-field"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time
                </label>
                <input
                  type="time"
                  name="startTime"
                  value={bookingData.startTime}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Time
                </label>
                <input
                  type="time"
                  name="endTime"
                  value={bookingData.endTime}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Instructions (Optional)
              </label>
              <textarea
                name="notes"
                value={bookingData.notes}
                onChange={handleInputChange}
                className="input-field"
                rows="4"
                placeholder="Any special requests or instructions..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary py-3"
            >
              {isSubmitting ? 'Creating Booking...' : 'Proceed to Payment'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
