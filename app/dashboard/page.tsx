import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import WelcomeSection from '@/components/WelcomeSection';

const prisma = new PrismaClient();

export default async function DashboardPage() {
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
    <main className="min-h-screen bg-slate-50 text-slate-800 flex items-center justify-center">
      <WelcomeSection isAdmin={isAdmin} />
    </main>
  );
}