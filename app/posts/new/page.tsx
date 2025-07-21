import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { PostForm } from "@/components/post";

export default async function NewPostPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-24">
      <div className="max-w-2xl mx-auto px-4">
        <PostForm />
      </div>
    </div>
  );
}
