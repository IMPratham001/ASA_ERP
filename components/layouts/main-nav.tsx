"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  FileText,
  Settings,
  Users,
  HelpCircle,
  Store,
  Calculator,
  Boxes
} from "lucide-react";

const mainNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Overview of your business"
  },
  {
    title: "Orders",
    href: "/orders",
    icon: ShoppingCart,
    description: "Manage customer orders"
  },
  {
    title: "Products",
    href: "/inventory",
    icon: Package,
    description: "Inventory management"
  },
  {
    title: "Finance",
    href: "/finance",
    icon: Calculator,
    description: "Financial management"
  },
  {
    title: "Stores",
    href: "/stores",
    icon: Store,
    description: "Manage your stores"
  },
  {
    title: "Users",
    href: "/users",
    icon: Users,
    description: "User management"
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    description: "System settings"
  },
  {
    title: "Help",
    href: "/help",
    icon: HelpCircle,
    description: "Get help and support"
  },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-start space-x-6">
      {mainNavItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center px-4 py-2 rounded-lg hover:bg-accent transition-colors group",
              pathname === item.href
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground"
            )}
          >
            <Icon className="w-5 h-5 mb-1" />
            <span className="text-sm font-medium">{item.title}</span>
            <span className="text-xs hidden group-hover:block text-muted-foreground">
              {item.description}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}