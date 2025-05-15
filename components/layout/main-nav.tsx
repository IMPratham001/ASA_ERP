'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { StoreSwitcher } from "../store-switcher";

const routes = [
  {
    href: '/dashboard',
    label: 'Dashboard',
  },
  {
    href: '/stores',
    label: 'Stores',
  },
  {
    href: '/inventory',
    label: 'Inventory',
  },
  {
    href: '/orders',
    label: 'Orders',
  },
  {
    href: '/finance',
    label: 'Finance',
  },
  {
    href: '/settings',
    label: 'Settings',
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="side-nav">
      <div className="px-6 py-4 border-b">
        <StoreSwitcher />
      </div>
      <div className="space-y-1 px-2 py-4">
        {routes.map((route) => (
          <Link key={route.href} href={route.href}>
            <Button
              variant={pathname === route.href ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              {route.label}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
}