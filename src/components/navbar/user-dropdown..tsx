"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  useUser,
  SignInButton,
  SignOutButton,
} from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { LogOut, Settings, User } from "lucide-react";
import Image from "next/image";

export default function UserDropdown() {
  const { user } = useUser();
  const router = useRouter();

  if (!user) {
    return (
      <SignInButton mode="modal">
        <Button variant="default">Sign In</Button>
      </SignInButton>
    );
  }

  const username =
    user.username ||
    user.primaryEmailAddress?.emailAddress.split("@")[0] ||
    "User";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-accent"
        >
          <Image
            src={user.imageUrl}
            alt="Profile"
            width={28}
            height={28}
            className="rounded-full"
          />
          <span className="font-medium text-sm max-w-[100px] truncate">
            {username}
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuItem
          onClick={() => router.push("/profile")}
          className="flex items-center gap-2"
        >
          <User className="w-4 h-4 text-muted-foreground" />
          <span>Profile</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => router.push("/settings")}
          className="flex items-center gap-2"
        >
          <Settings className="w-4 h-4 text-muted-foreground" />
          <span>Account Settings</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <SignOutButton>
          <DropdownMenuItem className="flex items-center gap-2 ">
            <LogOut className="w-4 h-4 text-muted-foreground" />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </SignOutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
