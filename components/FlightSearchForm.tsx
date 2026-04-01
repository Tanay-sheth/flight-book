import Link from 'next/link';

type AirportOption = {
  id: string;
  iata: string;
  city: string;
  country: string;
};

type FlightSearchFormProps = {
  airports: AirportOption[];
  values: {
    sourceAirportId: string;
    destinationAirportId: string;
    date: string;
    minPrice: string;
    maxPrice: string;
  };
};

export default function FlightSearchForm({ airports, values }: FlightSearchFormProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Find Your Flight</h1>
          <p className="mt-1 text-sm text-slate-600">
            Search by route, departure date, and budget to discover available options.
          </p>
        </div>
        <Link
          href="/dashboard/user"
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
        >
          Back to Dashboard
        </Link>
      </div>

      <form method="GET" action="/flights" className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
          Source
          <select
            name="sourceAirportId"
            defaultValue={values.sourceAirportId}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-0 transition focus:border-sky-500"
          >
            <option value="">Any source</option>
            {airports.map((airport) => (
              <option key={airport.id} value={airport.id}>
                {airport.iata} - {airport.city} ({airport.country})
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
          Destination
          <select
            name="destinationAirportId"
            defaultValue={values.destinationAirportId}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-0 transition focus:border-sky-500"
          >
            <option value="">Any destination</option>
            {airports.map((airport) => (
              <option key={airport.id} value={airport.id}>
                {airport.iata} - {airport.city} ({airport.country})
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
          Departure date
          <input
            type="date"
            name="date"
            defaultValue={values.date}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-0 transition focus:border-sky-500"
          />
        </label>

        <div className="grid grid-cols-2 gap-3 md:col-span-2 xl:col-span-1 xl:grid-cols-1">
          <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
            Min price
            <input
              type="number"
              name="minPrice"
              min={0}
              step="1"
              defaultValue={values.minPrice}
              placeholder="0"
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-0 transition focus:border-sky-500"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
            Max price
            <input
              type="number"
              name="maxPrice"
              min={0}
              step="1"
              defaultValue={values.maxPrice}
              placeholder="1500"
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-0 transition focus:border-sky-500"
            />
          </label>
        </div>

        <div className="flex items-end gap-2 md:col-span-2 xl:col-span-1">
          <button
            type="submit"
            className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-sky-600 px-4 text-sm font-semibold text-white transition hover:bg-sky-700"
          >
            Search
          </button>
          <Link
            href="/flights"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-300 px-4 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Reset
          </Link>
        </div>
      </form>

      {values.sourceAirportId &&
        values.destinationAirportId &&
        values.sourceAirportId === values.destinationAirportId && (
          <p className="mt-3 text-sm text-amber-700">
            Source and destination are the same. This may return no flights.
          </p>
        )}
    </section>
  );
}