import Link from "next/link";
import DesktopNavbar from "./desktop-navbar";
import MobileNavbar from "./mobile-navbar";
import ModeToggle from "./mode-toggle";
import UserDropdown from "./user-dropdown.";
import { currentUser } from "@clerk/nextjs/server";
import { syncUser } from "@/actions/user.actions";

export default async function Navbar() {
  const user = await currentUser();
  if (user) await syncUser(); //POST

  return (
    <nav className="sticky top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="max-w-7xl mx-auto px-4 relative h-16 flex items-center justify-between">
        {/* Left: Logo */}
        <Link href="/" className="text-xl font-bold tracking-wider z-10">
          🍥 Type<span className="text-primary">jp</span>
        </Link>

        {/* Center: Desktop Nav Links (absolute center) */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 z-0">
          <DesktopNavbar />
        </div>

        {/* Right: Mode toggle, Auth, Mobile nav */}
        <div className="flex items-center gap-2 z-10">
          {/* Desktop only: Theme toggle and Auth */}
          <div className="hidden md:flex items-center gap-2">
            <ModeToggle />
            <UserDropdown />
          </div>
          {/* Always show on mobile */}
          <MobileNavbar />
        </div>
      </div>
    </nav>
  );
}
