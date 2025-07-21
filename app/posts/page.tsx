import prisma from "@/lib/prisma";
import Link from "next/link";
import { formatName } from "@/lib/utils";

export default async function Posts() {
  const posts = await prisma.post.findMany({
    include: {
      author: true,
    },
    where: {
      published: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    cacheStrategy: {
      ttl: 60,
      swr: 60,
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Posts</h1>
          <Link
            href="/posts/new"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            New Post
          </Link>
        </div>
        <div className="space-y-4">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/posts/${post.id}`}
              className="block transition-transform hover:scale-[1.01]"
            >
              <article className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {post.title}
                </h2>
                <div className="text-sm text-gray-500">
                  by {formatName(post.author.name)}
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
