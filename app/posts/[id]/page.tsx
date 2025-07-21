import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { formatName } from "@/lib/utils";
import { auth } from "@/auth";

export default async function Post({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { id: parseInt(id) },
    include: {
      author: true,
    },
  });

  if (!post) {
    notFound();
  }

  const isAuthor = session?.user?.email === post.author.email;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <article>
            <header className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-4xl font-bold text-gray-900">
                  {post.title}
                </h1>
                {isAuthor && (
                  <Link
                    href={`/posts/${post.id}/edit`}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Edit Post
                  </Link>
                )}
              </div>

              {!post.published && (
                <div className="mb-6 bg-yellow-50 text-yellow-800 px-4 py-2 rounded-md text-sm">
                  This post is currently a draft
                </div>
              )}

              <div className="flex items-center gap-3">
                {post.author.image ? (
                  <Image
                    src={post.author.image}
                    alt={formatName(post.author.name)}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-gray-500 text-sm font-medium">
                      {(post.author.name || "User").charAt(0)}
                    </span>
                  </div>
                )}
                <Link
                  href={`/users/${post.authorId}`}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  By {formatName(post.author.name)}
                </Link>
              </div>
            </header>

            {post.content && (
              <>
                <div className="h-px bg-gray-100 mb-8" />
                <div className="prose prose-gray max-w-none">
                  {post.content}
                </div>
              </>
            )}
          </article>

          <div className="border-t border-gray-100 mt-12 pt-6">
            <Link
              href={`/users/${post.authorId}`}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              ← Back to author&apos;s profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
