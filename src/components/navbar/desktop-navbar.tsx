"use client";

import Link from "next/link";
import { navLinks } from "@/config/nav-links";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DesktopNavbar() {
  return (
    <div className="flex items-center space-x-2">
      {navLinks.map(({ href, label, icon: Icon, children }) =>
        children ? (
          <DropdownMenu key={href}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <Icon className="w-4 h-4" />
                <span className="hidden lg:inline">{label}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {children.map(({ href, label, icon: ChildIcon }) => (
                <DropdownMenuItem key={href} asChild>
                  <Link
                    href={href}
                    className="flex items-center gap-2 w-full text-sm"
                  >
                    <ChildIcon className="w-4 h-4" />
                    {label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
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
        )
      )}
    </div>
  );
}
