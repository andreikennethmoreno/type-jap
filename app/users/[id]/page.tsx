import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import Image from "next/image";
import Link from "next/link";
import { formatName } from "@/lib/utils";

export default async function UserProfile({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  const user = await prisma.user.findUnique({
    where: { id: parseInt(id) },
    include: {
      posts: {
        orderBy: { id: "desc" },
      },
    },
  });

  if (!user) {
    notFound();
  }

  const isOwnProfile = session?.user?.email === user.email;
  const posts = isOwnProfile
    ? user.posts
    : user.posts.filter((post) => post.published);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="flex items-center gap-6">
            {user.image ? (
              <Image
                src={user.image}
                alt={formatName(user.name)}
                width={80}
                height={80}
                className="rounded-full"
              />
            ) : (
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-gray-500 text-2xl font-medium">
                  {(user.name || "User").charAt(0)}
                </span>
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {formatName(user.name)}
              </h1>
              <Link
                href="/"
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                ← Back to all users
              </Link>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Published Posts
            </h2>
            {isOwnProfile && (
              <Link
                href="/posts/new"
                className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                New Post
              </Link>
            )}
          </div>
          {posts.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-100 p-8 text-center">
              <p className="text-gray-500 mb-4">
                {isOwnProfile
                  ? "You haven't published any posts yet."
                  : "No published posts yet."}
              </p>
              {isOwnProfile && (
                <Link
                  href="/posts/new"
                  className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-600 font-medium transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Write your first post
                </Link>
              )}
            </div>
          ) : (
            <div className="grid gap-4">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/posts/${post.id}`}
                  className="block transition-transform hover:scale-[1.01]"
                >
                  <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {post.title}
                      </h3>
                      {!post.published && (
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded">
                          Draft
                        </span>
                      )}
                    </div>
                    {post.content && (
                      <p className="text-gray-600 line-clamp-2">
                        {post.content}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
