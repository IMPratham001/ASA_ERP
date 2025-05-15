
"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import {
  LayoutDashboard,
  Users,
  Package,
  FileText,
  CreditCard,
  Clock,
  BarChart2,
  Settings,
  ChevronDown,
  PlusCircle,
  User,
  Lock,
} from "lucide-react";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-blue-600",
  },
  {
    label: "Customers",
    icon: Users,
    href: "/customers",
    color: "text-emerald-600",
  },
  {
    label: "Items",
    icon: Package,
    href: "/items",
    color: "text-violet-600",
  },
  {
    label: "Invoices",
    icon: FileText,
    href: "/invoices",
    color: "text-indigo-600",
  },
  {
    label: "Payments Received",
    icon: CreditCard,
    href: "/payments",
    color: "text-amber-600",
  },
  {
    label: "Expenses",
    icon: CreditCard,
    href: "/expenses",
    color: "text-rose-600",
  },
  {
    label: "Time Tracking",
    icon: Clock,
    href: "/time-tracking",
    color: "text-teal-600",
  },
  {
    label: "Reports",
    icon: BarChart2,
    href: "/reports",
    color: "text-sky-600",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
    color: "text-slate-600",
    subItems: [
      {
        label: "Profile",
        icon: User,
        href: "/settings/profile",
        color: "text-slate-600",
      },
      {
        label: "Security",
        icon: Lock,
        href: "/settings/security",
        color: "text-slate-600",
      },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [expandedSettings, setExpandedSettings] = React.useState(
    pathname.includes("/settings"),
  );

  return (
    <div className="side-nav bg-white border-r border-slate-200 h-screen">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-10">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-2">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <span className="font-bold text-xl text-slate-800">ASA-ERP</span>
        </div>

        <nav className="space-y-1.5">
          {routes.map((route) => {
            if (route.subItems) {
              return (
                <div key={route.href} className="space-y-1">
                  <button
                    onClick={() => setExpandedSettings(!expandedSettings)}
                    className={cn(
                      "w-full flex items-center justify-between gap-x-2 text-sm font-medium px-4 py-2.5 rounded-lg transition-colors",
                      pathname.includes(route.href)
                        ? "bg-slate-100 text-slate-900"
                        : "hover:bg-slate-50 text-slate-700",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <route.icon className={cn("h-5 w-5", route.color)} />
                      {route.label}
                    </div>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-slate-500 transition-transform",
                        expandedSettings ? "rotate-180" : "",
                      )}
                    />
                  </button>

                  {expandedSettings && (
                    <div className="pl-4 space-y-1 pt-1">
                      {route.subItems.map((subItem) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={cn(
                            "flex items-center gap-x-3 text-sm font-medium px-4 py-2 rounded-lg transition-colors",
                            pathname === subItem.href
                              ? "bg-slate-100 text-slate-900"
                              : "hover:bg-slate-50 text-slate-600",
                          )}
                        >
                          <subItem.icon
                            className={cn("h-4 w-4", subItem.color)}
                          />
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center gap-x-3 text-sm font-medium px-4 py-2.5 rounded-lg transition-colors",
                  pathname === route.href
                    ? "bg-slate-100 text-slate-900"
                    : "hover:bg-slate-50 text-slate-700",
                )}
              >
                <route.icon className={cn("h-5 w-5", route.color)} />
                {route.label}
                {route.badge && (
                  <span className="ml-auto bg-blue-600 text-xs text-white rounded-full h-5 w-5 flex items-center justify-center">
                    {route.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="mt-10 pt-6 border-t border-slate-200">
          <Link
            href="/create-invoice"
            className="flex items-center gap-x-2 text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2.5 rounded-lg transition-colors w-full justify-center"
          >
            <PlusCircle className="h-4 w-4" />
            Create New Invoice
          </Link>
        </div>
      </div>
    </div>
  );
}
