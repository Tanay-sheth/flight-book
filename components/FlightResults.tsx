import Link from 'next/link';
import Image from 'next/image';

type FlightResultItem = {
  id: string;
  flightNumber: string;
  departureTime: Date;
  arrivalTime: Date;
  durationMins: number;
  basePrice: number;
  origin: {
    iata: string;
    city: string;
  };
  destination: {
    iata: string;
    city: string;
  };
  airline: {
    name: string;
    logoUrl?: string | null;
  };
  airplane: {
    capacity: number;
  };
};

type FlightResultsProps = {
  flights: FlightResultItem[];
  hasFilters: boolean;
};

const formatDuration = (minutes: number) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
};

const getAirlineBadge = (name: string) => {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return 'AL';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0] ?? ''}${words[1][0] ?? ''}`.toUpperCase();
};

const estimateStops = (durationMins: number) => {
  if (durationMins <= 300) return 'Non-stop';
  if (durationMins <= 720) return '1 stop';
  return '2+ stops';
};

export default function FlightResults({ flights, hasFilters }: FlightResultsProps) {
  return (
    <section className="mt-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Flight Results</h2>
        <span className="text-sm text-slate-600">
          {flights.length} result{flights.length === 1 ? '' : 's'}
        </span>
      </div>

      {!hasFilters && (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
          Choose your route and date, then click Search to discover flights.
        </div>
      )}

      {hasFilters && flights.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
          No flights matched your filters. Try adjusting route, date, or budget range.
        </div>
      )}

      {flights.map((flight) => (
        <article key={flight.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-[1.2fr_1fr_auto] md:items-center">
            <div>
              <p className="text-sm font-semibold text-sky-700">{flight.flightNumber}</p>
              <div className="mt-1 flex items-center gap-2">
                {flight.airline.logoUrl ? (
                  <Image
                    src={flight.airline.logoUrl}
                    alt={`${flight.airline.name} logo`}
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full border border-slate-200 object-cover"
                  />
                ) : (
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                    {getAirlineBadge(flight.airline.name)}
                  </span>
                )}
                <p className="text-lg font-semibold text-slate-900">{flight.airline.name}</p>
              </div>
              <p className="mt-1 text-sm text-slate-600">
                {flight.origin.iata} ({flight.origin.city}) to {flight.destination.iata} ({flight.destination.city})
              </p>
            </div>

            <div className="text-sm text-slate-700">
              <p>
                <span className="font-medium">Depart:</span> {new Date(flight.departureTime).toLocaleString()}
              </p>
              <p>
                <span className="font-medium">Arrive:</span> {new Date(flight.arrivalTime).toLocaleString()}
              </p>
              <p>
                <span className="font-medium">Duration:</span> {formatDuration(flight.durationMins)}
              </p>
              <p>
                <span className="font-medium">Stops:</span> {estimateStops(flight.durationMins)}
              </p>
            </div>

            <div className="flex flex-col items-start gap-2 md:items-end">
              <p className="text-lg font-bold text-slate-900">${flight.basePrice.toFixed(2)}</p>
              <p className="text-xs text-slate-600">Remaining capacity: {flight.airplane.capacity}</p>
              <Link
                href={`/bookings/${flight.id}`}
                className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Book Now
              </Link>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}