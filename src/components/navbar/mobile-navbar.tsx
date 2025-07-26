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
import { useState, useEffect } from "react";
import Link from "next/link";
import { navLinks } from "@/config/nav-links";
import ModeToggle from "./mode-toggle";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import UserDropdown from "./user-dropdown.";

function MobileNavbar() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Close dropdown when sheet closes
  useEffect(() => {
    if (!showMobileMenu) {
      setOpenDropdown(null);
    }
  }, [showMobileMenu]);

  // Close menu when clicking outside dropdown areas
  const handleNavClick = () => {
    setShowMobileMenu(false);
    setOpenDropdown(null);
  };

  return (
    <div className="flex md:hidden items-center space-x-2">
      <ModeToggle />

      <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="relative z-50">
            <MenuIcon className="h-5 w-5" />
            <span className="sr-only">Open navigation menu</span>
          </Button>
        </SheetTrigger>

        <SheetContent
          side="right"
          className="w-[280px] sm:w-[300px] px-0 flex flex-col"
        >
          <SheetHeader className="px-6 pb-4 border-b">
            <SheetTitle className="text-lg font-semibold">
              Navigation
            </SheetTitle>
          </SheetHeader>

          <div className="px-6 py-2">
            <div className="space-y-1">
              <UserDropdown/>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto px-6 py-4">
            <div className="flex flex-col space-y-1">
              {navLinks.map(({ href, label, icon: Icon, children }) =>
                children ? (
                  <div key={href} className="space-y-1">
                    <button
                      className={cn(
                        "flex items-center w-full gap-3 text-left px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                        "hover:bg-accent hover:text-accent-foreground",
                        "focus:bg-accent focus:text-accent-foreground focus:outline-none",
                        openDropdown === href &&
                          "bg-accent text-accent-foreground"
                      )}
                      onClick={() =>
                        setOpenDropdown((prev) => (prev === href ? null : href))
                      }
                      aria-expanded={openDropdown === href}
                      aria-controls={`dropdown-${href}`}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span className="flex-1">{label}</span>
                      <ChevronDownIcon
                        className={cn(
                          "w-4 h-4 transition-transform duration-200",
                          openDropdown === href && "rotate-180"
                        )}
                      />
                    </button>

                    {openDropdown === href && (
                      <div
                        id={`dropdown-${href}`}
                        className="ml-7 space-y-1 animate-in slide-in-from-top-1 duration-200"
                      >
                        {children.map(
                          ({
                            href: childHref,
                            label: childLabel,
                            icon: ChildIcon,
                          }) => (
                            <Link
                              key={childHref}
                              href={childHref}
                              className={cn(
                                "flex items-center gap-3 text-sm px-3 py-2 rounded-md transition-colors",
                                "hover:bg-accent hover:text-accent-foreground",
                                "focus:bg-accent focus:text-accent-foreground focus:outline-none"
                              )}
                              onClick={handleNavClick}
                            >
                              <ChildIcon className="w-4 h-4 flex-shrink-0" />
                              <span>{childLabel}</span>
                            </Link>
                          )
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={href}
                    href={href}
                    onClick={handleNavClick}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                      "hover:bg-accent hover:text-accent-foreground",
                      "focus:bg-accent focus:text-accent-foreground focus:outline-none"
                    )}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{label}</span>
                  </Link>
                )
              )}
            </div>
          </nav>

          {/* Optional footer section for additional actions */}
          <div className="border-t px-6 py-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Theme</span>
              <ModeToggle />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default MobileNavbar;
