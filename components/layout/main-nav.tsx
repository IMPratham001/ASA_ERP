
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Package,
  Users,
  Settings,
  FileText,
  Home,
  Store,
  Clock,
  Wallet,
  BarChart2,
  FileBarChart2,
  Bell,
  Menu,
  X,
} from "lucide-react";

const mainNavItems = [
  {
    label: "Dashboard",
    icon: Home,
    href: "/dashboard",
    color: "text-sky-600 dark:text-sky-400",
  },
  {
    label: "Inventory",
    icon: Package,
    href: "/inventory",
    color: "text-green-600 dark:text-green-400",
  },
  {
    label: "Custom Orders",
    icon: Package,
    href: "/custom-orders",
    color: "text-purple-600 dark:text-purple-400",
    subItems: [
      { label: "All Orders", href: "/custom-orders" },
      { label: "New Order", href: "/custom-orders/create" },
    ],
  },
  {
    label: "Customers",
    icon: Users,
    href: "/customers",
    color: "text-pink-600 dark:text-pink-400",
  },
  {
    label: "Finance",
    icon: Wallet,
    href: "/finance",
    color: "text-yellow-600 dark:text-yellow-400",
    subItems: [
      { label: "Overview", href: "/finance" },
      { label: "Invoices", href: "/invoices" },
      { label: "Payments", href: "/payments" },
    ],
  },
  {
    label: "Reports",
    icon: FileBarChart2,
    href: "/reports",
    color: "text-red-600 dark:text-red-400",
  },
  {
    label: "Time Tracking",
    icon: Clock,
    href: "/time-tracking",
    color: "text-indigo-600 dark:text-indigo-400",
  },
  {
    label: "Staff",
    icon: Users,
    href: "/staff",
    color: "text-orange-600 dark:text-orange-400",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
    color: "text-gray-600 dark:text-gray-400",
    subItems: [
      { label: "Profile", href: "/settings/profile" },
      { label: "Security", href: "/settings/security" },
      { label: "Users", href: "/settings/users" },
    ],
  },
];

export default function MainNav() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [notifications] = useState([
    { id: 1, text: "New order received", read: false },
    { id: 2, text: "Payment confirmed", read: false },
    { id: 3, text: "Inventory low alert", read: true },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      {/* Mobile menu overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile menu button */}
      <button
        className="block lg:hidden p-2 -ml-2"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      {/* Navigation menu */}
      <nav
        className={`fixed lg:static top-0 left-0 bottom-0 z-50 w-64 bg-background lg:w-auto transform ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-200 ease-in-out`}
      >
        <div className="space-y-1 p-2 lg:p-0">
          {mainNavItems.map((item) => {
            const isActive = pathname === item.href;
            const isExpanded = expandedItem === item.label;

            return (
              <div key={item.label}>
                <Link
                  href={item.href}
                  className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground ${
                    isActive ? "bg-accent" : "transparent"
                  }`}
                  onClick={() => {
                    if (item.subItems) {
                      setExpandedItem(isExpanded ? null : item.label);
                    }
                    setIsMobileOpen(false);
                  }}
                >
                  <item.icon className={`mr-2 h-4 w-4 ${item.color}`} />
                  <span>{item.label}</span>
                  {item.subItems && (
                    <ChevronDown
                      className={`ml-auto h-4 w-4 transition-transform ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </Link>
                {item.subItems && isExpanded && (
                  <div className="ml-6 mt-1 space-y-1">
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className={`block rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground ${
                          pathname === subItem.href ? "bg-accent" : "transparent"
                        }`}
                        onClick={() => setIsMobileOpen(false)}
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Notification bell */}
        <button className="absolute top-4 right-4 lg:relative lg:top-auto lg:right-auto">
          <Bell className="h-6 w-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
              {unreadCount}
            </span>
          )}
        </button>
      </nav>
    </>
  );
}
