"use client";

import Form from "next/form";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { publishPost, saveDraft } from "@/app/actions";
import { Post } from "@prisma/client";

function SubmitButton({ isPublished }: { isPublished?: boolean }) {
  const { pending } = useFormStatus();

  return (
    <div className="flex gap-4">
      <button
        type="submit"
        disabled={pending}
        className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-6 py-2 rounded-lg font-medium transition-colors"
      >
        {isPublished ? "Update Post" : "Publish Post"}
      </button>
      {!isPublished && (
        <button
          formAction={saveDraft}
          disabled={pending}
          className="bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Save as Draft
        </button>
      )}
    </div>
  );
}

interface PostFormProps {
  post?: Post;
}

export function PostForm({ post }: PostFormProps) {
  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {!post ? "Create New Post" : "Edit Post"}
        </h1>
        {!!post && (
          <Link
            href={`/posts/${post?.id}`}
            className="text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            Cancel
          </Link>
        )}
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <Form action={publishPost} className="space-y-6">
          {post && <input type="hidden" name="postId" value={post.id} />}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              defaultValue={post?.title}
              placeholder="Enter your post title"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
            />
          </div>
          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Content
            </label>
            <textarea
              id="content"
              name="content"
              defaultValue={post?.content || ""}
              placeholder="Write your post content here..."
              rows={8}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
            />
          </div>
          <div className="flex justify-end pt-4">
            <SubmitButton isPublished={post && post.published} />
          </div>
        </Form>
      </div>
    </>
  );
}
