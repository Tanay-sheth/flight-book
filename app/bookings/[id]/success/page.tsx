import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/lib/auth';
import Link from 'next/link';

const prisma = new PrismaClient();

type SuccessPageProps = {
  params: Promise<{ id: string }>;
};

export default async function BookingSuccessPage({ params }: SuccessPageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect('/login');

  const { id } = await params;

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      flight: {
        include: {
          origin: true,
          destination: true,
          airline: true,
        },
      },
      passengers: true,
      bookedSeats: true,
    },
  });

  if (!booking || booking.userId !== session.user.id) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        {/* Success Banner */}
        <div className="mb-8 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-8 text-center text-white shadow-lg">
          <div className="mb-3 text-5xl">✅</div>
          <h1 className="text-3xl font-extrabold">Booking Confirmed!</h1>
          <p className="mt-2 text-emerald-100">
            Your seats have been reserved. Here are your booking details.
          </p>
        </div>

        {/* Booking Details Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {/* Reference */}
          <div className="mb-4 rounded-lg bg-slate-50 p-3 text-center">
            <span className="text-xs font-medium text-slate-400">Booking Reference</span>
            <p className="font-mono text-lg font-bold text-slate-800 tracking-wider">
              {booking.id.slice(0, 10).toUpperCase()}
            </p>
          </div>

          {/* Flight Info */}
          <div className="mb-4 grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-xs text-slate-400">Flight</span>
              <p className="font-semibold text-slate-800">{booking.flight.flightNumber}</p>
            </div>
            <div>
              <span className="text-xs text-slate-400">Airline</span>
              <p className="font-semibold text-slate-800">{booking.flight.airline.name}</p>
            </div>
            <div>
              <span className="text-xs text-slate-400">Route</span>
              <p className="font-semibold text-slate-800">
                {booking.flight.origin.iata} → {booking.flight.destination.iata}
              </p>
            </div>
            <div>
              <span className="text-xs text-slate-400">Status</span>
              <span className="inline-block rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700">
                {booking.status}
              </span>
            </div>
          </div>

          {/* Passengers */}
          <h3 className="mb-2 text-sm font-bold text-slate-700">Passengers & Seats</h3>
          <div className="space-y-2">
            {booking.passengers.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-4 py-2 text-sm"
              >
                <div>
                  <span className="font-semibold text-slate-800">{p.name}</span>
                  <span className="ml-2 text-xs text-slate-400">
                    Age {p.age} · ID: {p.passportId}
                  </span>
                </div>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                  Seat {p.seatLabel}
                </span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4">
            <span className="text-sm font-medium text-slate-500">Total Paid</span>
            <span className="text-2xl font-extrabold text-slate-900">
              ${booking.totalPrice.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-center gap-4">
          <Link
            href="/flights"
            className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-slate-700 active:scale-95"
          >
            Search More Flights
          </Link>
          <Link
            href="/dashboard/user"
            className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition-all hover:bg-slate-50 active:scale-95"
          >
            My Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
