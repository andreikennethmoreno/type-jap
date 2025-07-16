import Link from "next/link";
import DesktopNavbar from "./desktop-navbar";
import MobileNavbar from "./mobile-navbar";
import ModeToggle from "./mode-toggle";

export default function Navbar() {
  return (
    <nav className="sticky top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="max-w-7xl mx-auto px-4 relative h-16 flex items-center justify-between">
        {/* Left: Logo */}
        <Link
          href="/"
          className="text-xl font-bold text-primary tracking-wider z-10"
        >
          Logo
        </Link>

        {/* Center: Desktop Nav Links (absolute center) */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 z-0">
          <DesktopNavbar />
        </div>

        {/* Right: Desktop Toggle OR Mobile Toggle/Menu */}
        <div className="flex items-center gap-2 z-10">
          <div className="hidden md:block">
            <ModeToggle />
          </div>
          <MobileNavbar />
        </div>
      </div>
    </nav>
  );
}
