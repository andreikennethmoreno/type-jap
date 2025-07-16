import Link from "next/link";
import { Button } from "@/components/ui/button";
import { navLinks } from "@/config/nav-links";
import ModeToggle from "./mode-toggle";

async function DesktopNavbar() {
  return (
    <div className="hidden md:flex items-center space-x-2">
      {navLinks.map(({ href, label, icon: Icon }) => (
        <Button
          key={href}
          variant="ghost"
          className="flex items-center gap-2"
          asChild
        >
          <Link href={href}>
            <Icon className="w-4 h-4" />
            <span className="hidden lg:inline">{label}</span>
          </Link>
        </Button>
      ))}

      <ModeToggle />
    </div>
  );
}

export default DesktopNavbar;
