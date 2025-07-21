import { auth } from "@/auth";
import { PostForm } from "@/components/post";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";

export default async function EditPost({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  const post = await prisma.post.findUnique({
    where: { id: parseInt(id) },
    include: { author: true },
  });

  if (!post) {
    notFound();
  }

  // Verify the user is the author
  if (post.author.email !== session.user.email) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-24">
      <div className="max-w-2xl mx-auto px-4">
        <PostForm post={post} />
      </div>
    </div>
  );
}
