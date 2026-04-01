import { PrismaClient, FlightStatus } from '@prisma/client';

const prisma = new PrismaClient();

const airports = [
  { iata: 'JFK', name: 'John F. Kennedy International', city: 'New York', country: 'USA' },
  { iata: 'LAX', name: 'Los Angeles International', city: 'Los Angeles', country: 'USA' },
  { iata: 'ORD', name: 'O\'Hare International', city: 'Chicago', country: 'USA' },
  { iata: 'ATL', name: 'Hartsfield-Jackson Atlanta International', city: 'Atlanta', country: 'USA' },
  { iata: 'DFW', name: 'Dallas/Fort Worth International', city: 'Dallas', country: 'USA' },
  { iata: 'SFO', name: 'San Francisco International', city: 'San Francisco', country: 'USA' },
  { iata: 'SEA', name: 'Seattle-Tacoma International', city: 'Seattle', country: 'USA' },
  { iata: 'MIA', name: 'Miami International', city: 'Miami', country: 'USA' },
  { iata: 'LHR', name: 'Heathrow Airport', city: 'London', country: 'United Kingdom' },
  { iata: 'CDG', name: 'Charles de Gaulle', city: 'Paris', country: 'France' },
  { iata: 'HND', name: 'Tokyo Haneda', city: 'Tokyo', country: 'Japan' },
  { iata: 'DXB', name: 'Dubai International', city: 'Dubai', country: 'UAE' },
  { iata: 'SIN', name: 'Changi Airport', city: 'Singapore', country: 'Singapore' },
  { iata: 'SYD', name: 'Sydney Kingsford Smith', city: 'Sydney', country: 'Australia' },
  { iata: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany' },
  { iata: 'YYZ', name: 'Toronto Pearson', city: 'Toronto', country: 'Canada' },
  { iata: 'GRU', name: 'São Paulo–Guarulhos', city: 'São Paulo', country: 'Brazil' },
  { iata: 'JNB', name: 'O. R. Tambo International', city: 'Johannesburg', country: 'South Africa' },
  { iata: 'PEK', name: 'Beijing Capital', city: 'Beijing', country: 'China' },
  { iata: 'ICN', name: 'Incheon International', city: 'Seoul', country: 'South Korea' },
];

const airlines = [
  { name: 'Global Wings', code: 'GW', logoUrl: 'https://picsum.photos/seed/gw-airline/80/80' },
  { name: 'SkyPulse Airlines', code: 'SP', logoUrl: 'https://picsum.photos/seed/sp-airline/80/80' },
  { name: 'TransContinental', code: 'TC', logoUrl: 'https://picsum.photos/seed/tc-airline/80/80' },
  { name: 'Nimbus Air', code: 'NA', logoUrl: 'https://picsum.photos/seed/na-airline/80/80' },
  { name: 'AeroNova', code: 'AN', logoUrl: 'https://picsum.photos/seed/an-airline/80/80' },
];

const airplanes = [
  { model: 'Boeing 737', capacity: 160, airlineCode: 'GW' },
  { model: 'Airbus A320', capacity: 180, airlineCode: 'GW' },
  { model: 'Boeing 787', capacity: 240, airlineCode: 'SP' },
  { model: 'Airbus A330', capacity: 250, airlineCode: 'SP' },
  { model: 'Boeing 777', capacity: 300, airlineCode: 'TC' },
  { model: 'Airbus A350', capacity: 300, airlineCode: 'TC' },
  { model: 'Embraer E195', capacity: 120, airlineCode: 'NA' },
  { model: 'Bombardier CRJ900', capacity: 90, airlineCode: 'NA' },
  { model: 'Airbus A380', capacity: 500, airlineCode: 'AN' },
  { model: 'Boeing 747', capacity: 416, airlineCode: 'AN' },
];

const generateFlightNumber = (airlineCode: string, i: number) => `${airlineCode}${String(i).padStart(4, '0')}`;

const randomFrom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const sameDayDate = (base: Date, hoursOffset = 0, minsOffset = 0) => {
  const d = new Date(base);
  d.setHours(d.getHours() + hoursOffset);
  d.setMinutes(d.getMinutes() + minsOffset);
  d.setSeconds(0);
  d.setMilliseconds(0);
  return d;
};

async function main() {
  console.log('🌍 Clearing existing data...');
  await prisma.flight.deleteMany();
  await prisma.airplane.deleteMany();
  await prisma.airline.deleteMany();
  await prisma.airport.deleteMany();

  console.log('✈️  Seeding Airports...');
  const createdAirports = await Promise.all(
    airports.map((airport) =>
      prisma.airport.create({
        data: {
          iata: airport.iata,
          name: airport.name,
          city: airport.city,
          country: airport.country,
        },
      }),
    ),
  );

  console.log('🛩️  Seeding Airlines and Airplanes...');
  const createdAirlines = await Promise.all(
    airlines.map((airline) =>
      prisma.airline.create({
        data: {
          name: airline.name,
          code: airline.code,
          logoUrl: airline.logoUrl,
        },
      }),
    ),
  );

  const airlineByCode = new Map(createdAirlines.map((a) => [a.code, a]));

  const createdAirplanes = await Promise.all(
    airplanes.map((item) => {
      const airline = airlineByCode.get(item.airlineCode);
      if (!airline) throw new Error(`Unknown airline code ${item.airlineCode}`);
      return prisma.airplane.create({
        data: {
          model: item.model,
          capacity: item.capacity,
          airlineId: airline.id,
        },
      });
    }),
  );

  console.log('🧱 Seeding 50+ Flights...');
  const baseDate = new Date();

  const flightsToCreate = Array.from({ length: 55 }, (_, idx) => {
    const origin = randomFrom(createdAirports);
    let destination = randomFrom(createdAirports);
    while (destination.id === origin.id) {
      destination = randomFrom(createdAirports);
    }

    const airline = randomFrom(createdAirlines);
    const airplane = randomFrom(createdAirplanes.filter((ap) => ap.airlineId === airline.id)) || randomFrom(createdAirplanes);

    const departureOffsetH = Math.floor(Math.random() * 96); // next 4 days
    const durationMins = 60 + Math.floor(Math.random() * 720); // 1-12 hours
    const departure = sameDayDate(baseDate, departureOffsetH);
    const arrival = sameDayDate(departure, Math.floor(durationMins / 60), durationMins % 60);
    const statusRoll = Math.random();
    const status = statusRoll < 0.7 ? FlightStatus.SCHEDULED : statusRoll < 0.85 ? FlightStatus.DELAYED : statusRoll < 0.95 ? FlightStatus.BOARDING : FlightStatus.CANCELLED;

    return {
      flightNumber: generateFlightNumber(airline.code, idx + 1),
      originId: origin.id,
      destinationId: destination.id,
      airlineId: airline.id,
      airplaneId: airplane.id,
      departureTime: departure,
      arrivalTime: arrival,
      durationMins,
      basePrice: Number((150 + Math.random() * 1100).toFixed(2)),
      status,
    };
  });

  await prisma.flight.createMany({ data: flightsToCreate });

  console.log('✅ Seed completed: 20 airports, 5 airlines, 10 airplanes, 55 flights.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
