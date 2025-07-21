import { unstable_noStore as noStore } from "next/cache";
import Image from "next/image";
import Link from "next/link";

import { auth } from "@/auth";
import { SignInButton, SignOutButton } from "@/components/auth";
import prisma from "@/lib/prisma";
import { formatName } from "@/lib/utils";

import type { User } from "@prisma/client";
import type { Session } from "next-auth";

function UserMenu({ user }: { user: NonNullable<Session["user"]> }) {
  return (
    <div className="relative group">
      <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
        {user.image ? (
          <Image
            src={user.image}
            alt={formatName(user.name)}
            width={32}
            height={32}
            className="rounded-full"
          />
        ) : (
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-gray-500 text-sm font-medium">
              {(user.name || "U").charAt(0)}
            </span>
          </div>
        )}
        <span className="text-sm font-medium text-gray-700">
          {formatName(user.name)}
        </span>
        <svg
          className="w-4 h-4 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <div className="absolute right-0 mt-1 w-36 py-1 bg-white rounded-lg shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
        <Link
          href={`/users/${user.id}`}
          className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium hover:bg-gray-50 transition-colors"
        >
          View profile
        </Link>
        <SignOutButton />
      </div>
    </div>
  );
}

function UserCard({ user }: { user: User }) {
  return (
    <Link
      href={`/users/${user.id}`}
      className="block transition-transform hover:scale-[1.02]"
    >
      <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        {user.image ? (
          <Image
            src={user.image}
            alt={formatName(user.name)}
            width={40}
            height={40}
            className="rounded-full"
          />
        ) : (
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-gray-500 text-sm font-medium">
              {(user.name || "User").charAt(0)}
            </span>
          </div>
        )}
        <div>
          <div className="font-medium text-gray-900">
            {formatName(user.name)}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default async function Home() {
  noStore();

  const session = await auth();
  // limit to 100 users and cache for 60 seconds.
  const users = await prisma.user.findMany({
    take: 100,
    cacheStrategy: {
      ttl: 60,
      swr: 60,
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-b border-gray-100 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900">
            Superblog
          </Link>
          <div>
            {session?.user ? (
              <UserMenu user={session.user} />
            ) : (
              <SignInButton />
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-24 pb-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 font-[family-name:var(--font-geist-sans)]">
            Superblog
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            A demo application showcasing the power of Prisma Postgres and
            Next.js
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-900">
            Community Members
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {users.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
