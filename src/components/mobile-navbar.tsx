"use client";

import { MenuIcon } from "lucide-react";
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
import { ChevronDownIcon } from "lucide-react";

function MobileNavbar() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <div className="flex md:hidden items-center space-x-2">
      <ModeToggle />

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
          <nav className="flex flex-col space-y-2 mt-6">
            {navLinks.map(({ href, label, icon: Icon, children }) =>
              children ? (
                <div key={href}>
                  <button
                    className="flex items-center w-full gap-2 text-left px-3 py-2 text-sm hover:bg-muted rounded-md"
                    onClick={() =>
                      setOpenDropdown((prev) => (prev === href ? null : href))
                    }
                  >
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                    <ChevronDownIcon
                      className={`w-4 h-4 ml-auto transition-transform ${
                        openDropdown === href ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openDropdown === href && (
                    <div className="ml-6 mt-1 flex flex-col gap-1">
                      {children.map(
                        ({
                          href: childHref,
                          label: childLabel,
                          icon: ChildIcon,
                        }) => (
                          <Link
                            key={childHref}
                            href={childHref}
                            className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-md hover:bg-muted"
                            onClick={() => setShowMobileMenu(false)}
                          >
                            <ChildIcon className="w-4 h-4" />
                            {childLabel}
                          </Link>
                        )
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <Button
                  key={href}
                  variant="ghost"
                  className="flex items-center gap-3 justify-start"
                  asChild
                >
                  <Link href={href} onClick={() => setShowMobileMenu(false)}>
                    <Icon className="w-4 h-4" />
                    {label}
                  </Link>
                </Button>
              )
            )}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default MobileNavbar;
