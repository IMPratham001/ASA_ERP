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
import { useStore } from "@/lib/store/store"; // Import from your store path

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
  const { user, logout } = useStore((state) => ({
    user: state.user,
    logout: state.logout,
  }));

  const handleLogout = () => {
    logout();
    window.location.href = "/auth";
  };

  return (
    <div className="flex flex-col h-full bg-[#1C2237] text-white w-[204px] py-2">
      {/* App Logo */}
      <div className="px-4 py-5 flex items-center">
        <FileText className="w-6 h-6 mr-2" />
        <span className="text-lg font-semibold">Invoice</span>
      </div>

      {/* Getting Started Section */}
      <div className="px-2 mb-4">
        <Link
          href="/getting-started"
          className="flex items-center px-2 py-2.5 rounded-md hover:bg-white/10 text-white/90"
        >
          <span className="w-5 h-5 flex items-center justify-center mr-3">
            ⟐
          </span>
          <span className="text-sm">Getting Started</span>
          <span className="ml-auto">
            <ChevronRight className="w-4 h-4" />
          </span>
        </Link>
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
              {item.badge && (
                <span className="ml-auto bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse Button */}
      <div className="mt-auto border-t border-white/10 pt-2 px-2">
        <button className="w-full flex items-center justify-center p-2 text-white/70 hover:text-white">
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

// Add these if they're not already imported
function ChevronRight(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function ChevronLeft(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}
