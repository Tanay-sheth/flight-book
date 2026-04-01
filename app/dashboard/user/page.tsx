import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import UserFlightDashboard from '@/components/UserFlightDashboard';

const prisma = new PrismaClient();

export default async function UserPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  const isAdmin = user?.role === 'AIRPORT_MANAGER';

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      <div className="mx-auto max-w-7xl p-4">
        {isAdmin && (
          <div className="mb-4 text-right">
            <a href="/dashboard/admin" className="text-blue-600 hover:text-blue-800 underline">
              Go to Admin Panel
            </a>
          </div>
        )}
        <UserFlightDashboard />
      </div>
    </main>
  );
}