'use client';

import { useEffect, useState } from 'react';

type FlightStatus = 'SCHEDULED' | 'DELAYED' | 'BOARDING' | 'CANCELLED';

type Flight = {
  id: string;
  flightNumber: string;
  origin: { iata: string; city: string; country: string };
  destination: { iata: string; city: string; country: string };
  airline: { name: string; code: string };
  airplane: { model: string; capacity: number };
  departureTime: string;
  arrivalTime: string;
  durationMins: number;
  basePrice: number;
  status: FlightStatus;
};

const statusOptions: FlightStatus[] = ['SCHEDULED', 'DELAYED', 'BOARDING', 'CANCELLED'];

export default function AdminFlightDashboard() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadFlights = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/flights');
      if (!res.ok) throw new Error('Failed to load flights');
      const data: Flight[] = await res.json();
      setFlights(data);
      setError('');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFlights();
  }, []);

  const updateStatus = async (id: string, status: FlightStatus) => {
    // Optimistic update
    const previousFlights = [...flights];
    setFlights((prev) => prev.map((f) => (f.id === id ? { ...f, status } : f)));

    try {
      const res = await fetch(`/api/admin/flights/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      const updated = await res.json();
      setFlights((prev) => prev.map((f) => (f.id === id ? updated : f)));
    } catch (err) {
      // Revert on error
      setFlights(previousFlights);
      setError((err as Error).message);
    }
  };

  const deleteFlight = async (flightId: string) => {
    if (!window.confirm('Delete flight?')) return;
    const res = await fetch(`/api/admin/flights/${flightId}`, { method: 'DELETE' });
    if (!res.ok) {
      setError('Failed to delete flight');
      return;
    }
    setFlights((prev) => prev.filter((f) => f.id !== flightId));
  };

  return (
    <section className="p-4">
      <h1 className="text-2xl font-bold mb-4">Flight Management</h1>
      {error && <p className="text-red-600 mb-3">{error}</p>}
      {loading ? (
        <p>Loading flights...</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="text-xs uppercase bg-gray-100">
              <tr>
                <th className="px-3 py-2">Flight</th>
                <th className="px-3 py-2">Route</th>
                <th className="px-3 py-2">Airline / Airplane</th>
                <th className="px-3 py-2">Depart/Arrive</th>
                <th className="px-3 py-2">Price</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {flights.map((flight) => (
                <tr key={flight.id} className="border-t">
                  <td className="px-3 py-2 font-semibold">{flight.flightNumber}</td>
                  <td className="px-3 py-2">{flight.origin.iata} → {flight.destination.iata}</td>
                  <td className="px-3 py-2">{flight.airline.name} ({flight.airline.code}) / {flight.airplane.model}</td>
                  <td className="px-3 py-2">{new Date(flight.departureTime).toLocaleString()} / {new Date(flight.arrivalTime).toLocaleString()}</td>
                  <td className="px-3 py-2">${flight.basePrice.toFixed(2)}</td>
                  <td className="px-3 py-2">
                    <select
                      value={flight.status}
                      onChange={(e) => updateStatus(flight.id, e.target.value as FlightStatus)}
                      className="border rounded p-1"
                    >
                      {statusOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <button onClick={() => deleteFlight(flight.id)} className="text-red-600 hover:text-red-800">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {flights.length === 0 && <p className="p-4 text-gray-500">No flights available.</p>}
        </div>
      )}
    </section>
  );
}
