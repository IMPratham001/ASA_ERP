"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const mainNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
  },
  {
    title: "Orders",
    href: "/orders",
  },
  {
    title: "Inventory",
    href: "/inventory",
  },
  {
    title: "Finance",
    href: "/finance",
  },
  {
    title: "Users",
    href: "/users",
  },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex">
      <nav className="flex items-center space-x-6">
        {mainNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === item.href
                ? "text-black dark:text-white"
                : "text-muted-foreground"
            )}
          >
            {item.title}
          </Link>
        ))}
      </nav>
    </div>
  );
}