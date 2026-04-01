'use client';

interface WelcomeSectionProps {
  isAdmin: boolean;
}

export default function WelcomeSection({ isAdmin }: WelcomeSectionProps) {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to XYZ Flight Booking</h1>
      {isAdmin ? (
        <div className="space-x-4">
          <button
            onClick={() => window.location.href = '/dashboard/admin'}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 text-lg"
          >
            Go to Admin Panel
          </button>
          <button
            onClick={() => window.location.href = '/flights'}
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 text-lg"
          >
            Explore User Flow
          </button>
        </div>
      ) : (
        <button
          onClick={() => window.location.href = '/flights'}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 text-lg"
        >
          Search Flights
        </button>
      )}
    </div>
  );
}