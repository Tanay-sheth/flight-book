"use client";

import Link from "next/link";
import { signOut, useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo / App Name */}
        <div className="flex items-center">
          <Link href={session ? "/dashboard" : "/"} className="text-xl font-bold text-gray-900">
            🚀 Flight-booker
          </Link>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-4">
              <span className="hidden text-sm text-gray-500 sm:block">
                {session.user.email}
              </span>
              <button
                onClick={handleLogout}
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Sign Out
              </button>
            </div>
          ) : (
             // Optional: Show Login button if not on login page
             <Link
               href="/login"
               className="rounded-md bg-black px-3 py-2 text-sm font-medium text-white hover:bg-gray-800"
             >
               Login
             </Link>
          )}
        </div>
      </div>
    </nav>
  );
}