"use client";

import Link from "next/link";
import { SlashIcon } from "lucide-react";
import { usePathname } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function BreadcrumbBar() {
  const pathname = usePathname();

  const segments = pathname.split("/").filter((segment) => segment !== "");

  const breadcrumbs = segments.map((segment, i) => {
    const href = "/" + segments.slice(0, i + 1).join("/");
    const isLast = i === segments.length - 1;

    const label = decodeURIComponent(segment)
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase()); // Capitalize words

    return (
      <BreadcrumbItem key={href}>
        {isLast ? (
          <BreadcrumbPage>{label}</BreadcrumbPage>
        ) : (
          <BreadcrumbLink asChild>
            <Link href={href}>{label}</Link>
          </BreadcrumbLink>
        )}
      </BreadcrumbItem>
    );
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {segments.length > 0 && (
          <BreadcrumbSeparator>
            <SlashIcon className="w-4 h-4" />
          </BreadcrumbSeparator>
        )}

        {breadcrumbs.flatMap((item, i) => [
          item,
          i < segments.length - 1 && (
            <BreadcrumbSeparator key={`sep-${i}`}>
              <SlashIcon className="w-4 h-4" />
            </BreadcrumbSeparator>
          ),
        ])}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
