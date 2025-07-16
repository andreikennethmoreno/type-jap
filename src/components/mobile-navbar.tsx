"use client";

import { LogOutIcon, MenuIcon, MoonIcon, SunIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import Link from "next/link";
import { navLinks } from "@/config/nav-links";
import ModeToggle from "./mode-toggle";

function MobileNavbar() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <div className="flex md:hidden items-center space-x-2">
      <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <MenuIcon className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px]">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col space-y-4 mt-6">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Button
                key={href}
                variant="ghost"
                className="flex items-center gap-3 justify-start"
                asChild
              >
                <Link href={href}>
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              </Button>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      <ModeToggle />
    </div>
  );
}

export default MobileNavbar;
