import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import AdminFlightDashboard from '@/components/AdminFlightDashboard';

const prisma = new PrismaClient();

export default async function AdminPage() {
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

  const role = user?.role || 'USER';
  if (role !== 'AIRPORT_MANAGER') {
    redirect('/dashboard/user');
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      <div className="mx-auto max-w-7xl p-4">
        <div className="mb-4">
          <a href="/dashboard/user" className="text-blue-600 hover:text-blue-800 underline">
            View as User
          </a>
        </div>
        <AdminFlightDashboard />
      </div>
    </main>
  );
}