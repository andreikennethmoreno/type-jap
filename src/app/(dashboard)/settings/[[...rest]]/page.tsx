import { UserProfile } from "@clerk/nextjs";

export default function ProfilePage() {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <UserProfile />
    </div>
  );
}
