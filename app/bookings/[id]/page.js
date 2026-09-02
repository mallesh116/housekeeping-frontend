'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';

export default function BookingDetails() {
  const params = useParams();
  const bookingId = params.id;
  const router = useRouter();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchBookingDetails();
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${bookingId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setBooking(response.data);
    } catch (err) {
      setError('Failed to load booking details');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setIsProcessingPayment(true);
    setError('');

    try {
      const token = localStorage.getItem('token');

      // Create checkout session
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/payments/create-checkout`,
        { bookingId },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Redirect to Stripe checkout (in production)
      // For demo, just show success message
      alert('Payment system integrated. In production, this will redirect to Stripe checkout.');
      window.location.href = `/bookings/${bookingId}?payment=success`;
    } catch (err) {
      setError(err.response?.data?.error || 'Payment processing failed');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  if (loading) {
    return <div className="container py-12 text-center">Loading...</div>;
  }

  if (!booking) {
    return <div className="container py-12 text-center text-red-600">Booking not found</div>;
  }

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Booking Details</h1>

      {error && <div className="alert-error">{error}</div>}

      <div className="grid md:grid-cols-2 gap-8">
        {/* Booking Info */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">{booking.title}</h2>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Housekeeper</p>
              <p className="text-lg font-semibold">
                {booking.first_name} {booking.last_name}
              </p>
              <p className="text-sm text-gray-600">{booking.phone}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Date & Time</p>
              <p className="text-lg font-semibold">
                {new Date(booking.booking_date).toLocaleDateString()}
              </p>
              <p className="text-gray-600">{booking.start_time} - {booking.end_time}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Service Description</p>
              <p className="text-gray-700">{booking.description}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Special Instructions</p>
              <p className="text-gray-700">{booking.notes || 'None'}</p>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm text-gray-600">Status</p>
              <p className="text-lg font-semibold capitalize">{booking.status}</p>
            </div>
          </div>
        </div>

        {/* Payment Section */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">Payment</h2>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Service Fee</span>
              <span className="font-semibold">${booking.total_price}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-4">
              <span>Total</span>
              <span>${booking.total_price}</span>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Payment Status:</strong> {booking.payment_status}
            </p>
          </div>

          {booking.payment_status === 'pending' && (
            <button
              onClick={handlePayment}
              disabled={isProcessingPayment}
              className="w-full btn-success py-3"
            >
              {isProcessingPayment ? 'Processing...' : 'Pay with Stripe'}
            </button>
          )}

          {booking.payment_status === 'paid' && (
            <div className="alert-success">
              Payment completed successfully!
            </div>
          )}

          <div className="mt-6 pt-6 border-t space-y-3">
            <button className="w-full btn-secondary">
              Message Housekeeper
            </button>
            <button className="w-full btn-secondary">
              Reschedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
