
'use client';

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  DashboardIcon,
  PersonIcon,
  ReaderIcon,
  BackpackIcon,
  GearIcon,
  FileIcon,
  BarChartIcon,
} from "@radix-ui/react-icons";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: DashboardIcon },
  { href: "/customers", label: "Customers", icon: PersonIcon },
  { href: "/invoices", label: "Invoices", icon: FileIcon },
  { href: "/inventory", label: "Inventory", icon: BackpackIcon },
  { href: "/reports", label: "Reports", icon: BarChartIcon },
  { href: "/settings", label: "Settings", icon: GearIcon },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-background">
      <div className="flex h-full flex-col">
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">Your App</span>
          </Link>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Button
              key={href}
              asChild
              variant={pathname === href ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <Link href={href}>
                <Icon className="mr-2 h-4 w-4" />
                {label}
              </Link>
            </Button>
          ))}
        </nav>
      </div>
    </aside>
  );
}
