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
  Clock,
  BarChart2,
  CreditCard,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store/store";

const mainNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Customers",
    href: "/customers",
    icon: Users,
  },
  {
    title: "Products",
    href: "/inventory",
    icon: Package,
  },
  {
    title: "Quotes",
    href: "/quotes",
    icon: FileText,
  },
  {
    title: "Orders",
    href: "/orders",
    icon: ShoppingCart,
  },
  {
    title: "Invoices",
    href: "/invoices",
    icon: FileText,
  },
  {
    title: "Payments",
    href: "/payments",
    icon: CreditCard,
  },
  {
    title: "Expenses",
    href: "/expenses",
    icon: Calculator,
  },
  {
    title: "Time Tracking",
    href: "/time-tracking",
    icon: Clock,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: BarChart2,
  },
  {
    title: "Advanced Billing",
    href: "/finance",
    icon: CreditCard,
  },
];

export function MainNav() {
  const pathname = usePathname();
  const { user } = useStore();

  return (
    <div className="flex flex-col h-full bg-[#1C2237] text-white w-[204px] py-2">
      {/* App Logo */}
      <div className="px-4 py-5 flex items-center">
        <FileText className="w-6 h-6 mr-2" />
        <span className="text-lg font-semibold">ASA ERP</span>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-2 overflow-y-auto">
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center px-2 py-2.5 rounded-md relative mb-1 group",
                isActive
                  ? "bg-blue-600/20 text-blue-400"
                  : "text-white/70 hover:bg-white/10 hover:text-white",
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-full" />
              )}
              <Icon
                className={cn(
                  "w-5 h-5 mr-3",
                  isActive ? "text-blue-400" : "text-white/70",
                )}
              />
              <span className="text-sm font-medium">{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      {user && (
        <div className="px-4 py-3 mt-auto border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-white/60 truncate">{user.email}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-white/70 hover:text-white"
              onClick={() => {
                useStore.setState({ user: null });
                window.location.href = '/auth';
              }}
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}