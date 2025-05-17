"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
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
  User,
  Lock,
  Menu,
  X,
  Search,
  LogOut,
  Moon,
  Sun,
  PlusCircle,
  FilePlus,
  UserPlus,
  PackagePlus,
  FileCheck,
  ChevronRight,
  Bell,
  MessageSquare,
  HelpCircle,
  Info,
} from "lucide-react";

// Configuration for navigation items
const sidebarItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-blue-600 dark:text-blue-400",
    badge: {
      text: "New",
      color: "bg-blue-500",
    },
  },
  {
    label: "Custom Orders",
    icon: Package,
    href: "/custom-orders",
    color: "text-purple-600 dark:text-purple-400",
    badge: {
      text: "12",
      color: "bg-purple-500",
    },
  },
  {
    label: "Document Vault",
    icon: FileText,
    href: "/documents",
    color: "text-amber-600 dark:text-amber-400",
  },
  {
    label: "Activity Logs",
    icon: Clock,
    href: "/logs",
    color: "text-cyan-600 dark:text-cyan-400",
  },
  {
    label: "Customers",
    icon: Users,
    href: "/customers",
    color: "text-emerald-600 dark:text-emerald-400",
    badge: {
      text: "5",
      color: "bg-emerald-500",
    },
  },
  {
    label: "Inventory",
    icon: Package,
    href: "/inventory",
    color: "text-orange-600 dark:text-orange-400",
  },
  {
    label: "Items",
    icon: Package,
    href: "/items",
    color: "text-violet-600 dark:text-violet-400",
    subItems: [
      {
        label: "All Items",
        icon: Package,
        href: "/items",
        color: "text-violet-600 dark:text-violet-400",
      },
      {
        label: "Add Item",
        icon: PackagePlus,
        href: "/items/create",
        color: "text-violet-600 dark:text-violet-400",
      },
      {
        label: "Categories",
        icon: FileCheck,
        href: "/items/categories",
        color: "text-violet-600 dark:text-violet-400",
      },
    ],
  },
  {
    label: "Billing",
    icon: FileText,
    href: "/create-invoice",
    color: "text-indigo-600 dark:text-indigo-400",
    subItems: [
      {
        label: "Create Invoice",
        icon: FilePlus,
        href: "/create-invoice",
        color: "text-indigo-600 dark:text-indigo-400",
      },
      {
        label: "All Invoices",
        icon: FileText,
        href: "/invoices",
        color: "text-indigo-600 dark:text-indigo-400",
      },
    ],
  },
  {
    label: "Payments",
    icon: CreditCard,
    href: "/payments",
    color: "text-amber-600 dark:text-amber-400",
  },
  {
    label: "Time Tracking",
    icon: Clock,
    href: "/time-tracking",
    color: "text-teal-600 dark:text-teal-400",
  },
  {
    label: "Reports",
    icon: BarChart2,
    href: "/reports",
    color: "text-sky-600 dark:text-sky-400",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
    color: "text-slate-600 dark:text-slate-400",
    subItems: [
      {
        label: "Profile",
        icon: User,
        href: "/settings/profile",
        color: "text-slate-600 dark:text-slate-400",
      },
      {
        label: "Security",
        icon: Lock,
        href: "/settings/security",
        color: "text-slate-600 dark:text-slate-400",
      },
    ],
  },
];

// Quick action buttons
const quickActions = [
  {
    label: "New Invoice",
    icon: FilePlus,
    href: "/create-invoice",
    color:
      "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
  },
  {
    label: "Add Customer",
    icon: UserPlus,
    href: "/customers/create",
    color:
      "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700",
  },
  {
    label: "Add Item",
    icon: PackagePlus,
    href: "/items/create",
    color:
      "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700",
  },
];

// Help center items
const helpItems = [
  {
    label: "Documentation",
    icon: FileText,
    href: "/help/docs",
  },
  {
    label: "FAQs",
    icon: HelpCircle,
    href: "/help/faqs",
  },
  {
    label: "Contact Support",
    icon: MessageSquare,
    href: "/help/support",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showHelpCenter, setShowHelpCenter] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New order received",
      message: "Customer #1234 placed a new order",
      time: "5 min ago",
      read: false,
    },
    {
      id: 2,
      title: "Payment received",
      message: "Invoice #5678 has been paid",
      time: "1 hour ago",
      read: false,
    },
    {
      id: 3,
      title: "New customer registered",
      message: "Jane Doe created an account",
      time: "3 hours ago",
      read: true,
    },
  ]);

  // Refs for click outside detection
  const sidebarRef = useRef(null);
  const searchResultsRef = useRef(null);
  const notificationsRef = useRef(null);
  const helpCenterRef = useRef(null);

  // Toggle expanded state for items with subitems
  const toggleExpanded = useCallback((label) => {
    setExpandedItems((prev) => ({
      ...prev,
      [label.toLowerCase()]: !prev[label.toLowerCase()],
    }));
  }, []);

  // Handle search
  const handleSearch = useCallback((query) => {
    setSearchQuery(query);

    if (query.trim() === "") {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    // Search through sidebar items and their subitems
    const results = [];
    sidebarItems.forEach((item) => {
      if (item.label.toLowerCase().includes(query.toLowerCase())) {
        results.push(item);
      }

      if (item.subItems) {
        item.subItems.forEach((subItem) => {
          if (subItem.label.toLowerCase().includes(query.toLowerCase())) {
            results.push({
              ...subItem,
              parentLabel: item.label,
            });
          }
        });
      }
    });

    setSearchResults(results);
    setShowSearchResults(true);
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  }, []);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchResultsRef.current &&
        !searchResultsRef.current.contains(event.target)
      ) {
        setShowSearchResults(false);
      }

      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }

      if (
        helpCenterRef.current &&
        !helpCenterRef.current.contains(event.target)
      ) {
        setShowHelpCenter(false);
      }

      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        event.target.id !== "mobile-menu-button"
      ) {
        setIsMobileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close mobile menu on navigation
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Filtered sidebar items based on search query
  const filteredItems =
    searchQuery.trim() !== ""
      ? sidebarItems.filter((item) =>
          item.label.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      : sidebarItems;

  // Get unread notifications count
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      {/* Mobile menu overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile menu toggle button */}
      <button
        id="mobile-menu-button"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-white dark:bg-slate-800 p-2 rounded-md shadow-md"
      >
        {isMobileOpen ? (
          <X className="h-6 w-6 text-slate-700 dark:text-slate-200" />
        ) : (
          <Menu className="h-6 w-6 text-slate-700 dark:text-slate-200" />
        )}
      </button>

      {/* Sidebar */}
      <motion.aside
        ref={sidebarRef}
        initial={false}
        animate={{
          width: isCollapsed ? 80 : 280,
          x: isMobileOpen ? 0 : window.innerWidth < 768 ? -280 : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 h-screen z-40 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 shadow-sm"
      >
        <div className="flex flex-col h-full">
          {/* Logo & Company Name */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              {!isCollapsed && (
                <div className="flex flex-col">
                  <span className="font-bold text-lg text-slate-800 dark:text-white">
                    Acme Inc
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Business Dashboard
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Search */}
          <div className={cn("px-4 pt-4 pb-2", isCollapsed && "px-2")}>
            <div className="relative">
              <Search
                className={cn(
                  "absolute text-slate-400 z-10",
                  isCollapsed
                    ? "left-2.5 top-2.5 h-5 w-5"
                    : "left-3 top-3 h-4 w-4",
                )}
              />
              <input
                type="text"
                placeholder={isCollapsed ? "" : "Search..."}
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className={cn(
                  "w-full rounded-md bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-slate-300 dark:focus:border-slate-600 focus:ring-0 transition-colors",
                  isCollapsed
                    ? "pl-9 pr-2 py-2 text-sm"
                    : "pl-9 pr-4 py-2.5 text-sm",
                )}
              />

              {/* Search results dropdown */}
              <AnimatePresence>
                {showSearchResults &&
                  searchResults.length > 0 &&
                  !isCollapsed && (
                    <motion.div
                      ref={searchResultsRef}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-lg z-50"
                    >
                      <div className="p-2 max-h-64 overflow-y-auto">
                        {searchResults.map((result, index) => (
                          <Link
                            key={`${result.href}-${index}`}
                            href={result.href}
                            className="flex items-center gap-2 p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                            onClick={() => setShowSearchResults(false)}
                          >
                            <result.icon
                              className={cn("w-4 h-4", result.color)}
                            />
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">
                                {result.label}
                              </span>
                              {result.parentLabel && (
                                <span className="text-xs text-slate-500">
                                  in {result.parentLabel}
                                </span>
                              )}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
              </AnimatePresence>
            </div>
          </div>

          {/* User section */}
          {!isCollapsed && (
            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                  <User className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-slate-800 dark:text-white">
                    John Doe
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Administrator
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="px-3 py-3 border-b border-slate-200 dark:border-slate-700">
            <h3
              className={cn(
                "text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 px-1",
                isCollapsed && "text-center",
              )}
            >
              {!isCollapsed && "QUICK ACTIONS"}
            </h3>
            <div
              className={cn(
                "space-y-2",
                isCollapsed && "flex flex-col items-center gap-2",
              )}
            >
              {quickActions.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className={cn(
                    "flex items-center gap-2 p-2 rounded-md text-white transition-all shadow-sm hover:shadow-md",
                    action.color,
                    isCollapsed ? "w-12 h-12 justify-center" : "px-3 py-2.5",
                  )}
                >
                  <action.icon
                    className={cn("w-5 h-5", isCollapsed && "w-6 h-6")}
                  />
                  {!isCollapsed && (
                    <span className="text-sm font-medium">{action.label}</span>
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-2 px-3">
            <div className="space-y-0.5">
              {filteredItems.map((item) => (
                <div key={item.href}>
                  {item.subItems ? (
                    <div className="space-y-0.5">
                      <button
                        onClick={() => toggleExpanded(item.label)}
                        className={cn(
                          "w-full flex items-center gap-2 p-2 rounded-md transition-colors",
                          expandedItems[item.label.toLowerCase()]
                            ? "bg-slate-100 dark:bg-slate-800"
                            : pathname.startsWith(item.href)
                              ? "bg-slate-50 dark:bg-slate-800/50"
                              : "hover:bg-slate-50 dark:hover:bg-slate-800/50",
                          isCollapsed && "justify-center",
                        )}
                      >
                        <item.icon className={cn("w-5 h-5", item.color)} />
                        {!isCollapsed && (
                          <>
                            <span className="flex-1 text-sm font-medium">
                              {item.label}
                            </span>
                            {item.badge && (
                              <span
                                className={`px-1.5 py-0.5 text-xs rounded-full text-white ${item.badge.color}`}
                              >
                                {item.badge.text}
                              </span>
                            )}
                            <ChevronDown
                              className={cn(
                                "w-4 h-4 transition-transform text-slate-400",
                                expandedItems[item.label.toLowerCase()] &&
                                  "rotate-180",
                              )}
                            />
                          </>
                        )}
                      </button>
                      <AnimatePresence>
                        {expandedItems[item.label.toLowerCase()] &&
                          !isCollapsed && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="pl-4 space-y-0.5 overflow-hidden"
                            >
                              {item.subItems.map((subItem) => (
                                <Link
                                  key={subItem.href}
                                  href={subItem.href}
                                  className={cn(
                                    "flex items-center gap-2 py-2 px-3 ml-4 border-l border-slate-200 dark:border-slate-700 rounded-r-md text-sm transition-colors",
                                    pathname === subItem.href
                                      ? "bg-slate-100 dark:bg-slate-800 border-l-2 border-l-blue-500 ml-3.5"
                                      : "hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400",
                                  )}
                                >
                                  <subItem.icon
                                    className={cn("w-4 h-4", subItem.color)}
                                  />
                                  <span>{subItem.label}</span>
                                </Link>
                              ))}
                            </motion.div>
                          )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2 p-2 rounded-md transition-colors",
                        pathname === item.href
                          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium"
                          : "hover:bg-slate-50 dark:hover:bg-slate-800/50",
                        isCollapsed && "justify-center",
                      )}
                    >
                      <item.icon
                        className={cn(
                          "w-5 h-5",
                          pathname === item.href
                            ? "text-blue-600 dark:text-blue-400"
                            : item.color,
                        )}
                      />
                      {!isCollapsed && (
                        <>
                          <span className="text-sm">{item.label}</span>
                          {item.badge && (
                            <span
                              className={`ml-auto px-1.5 py-0.5 text-xs rounded-full text-white ${item.badge.color}`}
                            >
                              {item.badge.text}
                            </span>
                          )}
                        </>
                      )}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-700 mt-auto">
            <div className="flex items-center justify-between">
              {!isCollapsed ? (
                <>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setTheme(theme === "dark" ? "light" : "dark")
                      }
                      className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      aria-label={
                        theme === "dark"
                          ? "Switch to light mode"
                          : "Switch to dark mode"
                      }
                    >
                      {theme === "dark" ? (
                        <Sun className="w-5 h-5 text-amber-500" />
                      ) : (
                        <Moon className="w-5 h-5 text-slate-600" />
                      )}
                    </button>

                    {/* Notifications button */}
                    <div className="relative">
                      <button
                        onClick={() => {
                          setShowNotifications(!showNotifications);
                          setShowHelpCenter(false);
                        }}
                        className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        aria-label="Notifications"
                      >
                        <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                        {unreadCount > 0 && (
                          <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                            {unreadCount}
                          </span>
                        )}
                      </button>

                      {/* Notifications dropdown */}
                      <AnimatePresence>
                        {showNotifications && (
                          <motion.div
                            ref={notificationsRef}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute right-0 bottom-full mb-2 w-72 bg-white dark:bg-slate-800 rounded-md shadow-lg border border-slate-200 dark:border-slate-700 z-50"
                          >
                            <div className="p-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                              <h3 className="font-medium">Notifications</h3>
                              <button
                                onClick={markAllAsRead}
                                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                              >
                                Mark all as read
                              </button>
                            </div>
                            <div className="max-h-72 overflow-y-auto">
                              {notifications.length > 0 ? (
                                notifications.map((notif) => (
                                  <div
                                    key={notif.id}
                                    className={cn(
                                      "p-3 border-b border-slate-200 dark:border-slate-700 last:border-0",
                                      !notif.read &&
                                        "bg-blue-50 dark:bg-blue-900/20",
                                    )}
                                  >
                                    <div className="flex items-start gap-2">
                                      <div
                                        className={cn(
                                          "w-2 h-2 rounded-full mt-1.5",
                                          notif.read
                                            ? "bg-slate-300 dark:bg-slate-600"
                                            : "bg-blue-500",
                                        )}
                                      />
                                      <div className="flex-1">
                                        <h4 className="text-sm font-medium">
                                          {notif.title}
                                        </h4>
                                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                                          {notif.message}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-1">
                                          {notif.time}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="p-4 text-center text-sm text-slate-500">
                                  No notifications
                                </div>
                              )}
                            </div>
                            <div className="p-2 border-t border-slate-200 dark:border-slate-700">
                              <Link
                                href="/notifications"
                                className="block text-center text-xs text-blue-600 dark:text-blue-400 hover:underline py-1"
                              >
                                View all notifications
                              </Link>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Help center button */}
                    <div className="relative">
                      <button
                        onClick={() => {
                          setShowHelpCenter(!showHelpCenter);
                          setShowNotifications(false);
                        }}
                        className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        aria-label="Help Center"
                      >
                        <HelpCircle className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                      </button>

                      {/* Help center dropdown */}
                      <AnimatePresence>
                        {showHelpCenter && (
                          <motion.div
                            ref={helpCenterRef}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute right-0 bottom-full mb-2 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg border border-slate-200 dark:border-slate-700 z-50"
                          >
                            <div className="p-3 border-b border-slate-200 dark:border-slate-700">
                              <h3 className="font-medium">Help Center</h3>
                            </div>
                            <div className="p-2">
                              {helpItems.map((item) => (
                                <Link
                                  key={item.href}
                                  href={item.href}
                                  className="flex items-center gap-2 p-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                >
                                  <item.icon className="w-4 h-4 text-slate-500" />
                                  <span>{item.label}</span>
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsCollapsed(true)}
                    className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    aria-label="Collapse sidebar"
                  >
                    <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 items-center w-full">
                  <button
                    onClick={() =>
                      setTheme(theme === "dark" ? "light" : "dark")
                    }
                    className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 w-full flex justify-center"
                    aria-label={
                      theme === "dark"
                        ? "Switch to light mode"
                        : "Switch to dark mode"
                    }
                  >
                    {theme === "dark" ? (
                      <Sun className="w-5 h-5 text-amber-500" />
                    ) : (
                      <Moon className="w-5 h-5 text-slate-600" />
                    )}
                  </button>

                  {/* Collapsed notifications button */}
                  <button
                    onClick={() => {
                      setShowNotifications(!showNotifications);
                      setShowHelpCenter(false);
                    }}
                    className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 w-full flex justify-center relative"
                    aria-label="Notifications"
                  >
                    <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Collapsed help center button */}
                  <button
                    onClick={() => {
                      setShowHelpCenter(!showHelpCenter);
                      setShowNotifications(false);
                    }}
                    className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 w-full flex justify-center"
                    aria-label="Help Center"
                  >
                    <HelpCircle className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  </button>

                  <button
                    onClick={() => setIsCollapsed(false)}
                    className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 w-full flex justify-center"
                    aria-label="Expand sidebar"
                  >
                    <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-400 rotate-180" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Logout button */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-700">
            <Link
              href="/logout"
              className={cn(
                "flex items-center gap-2 p-2 rounded-md text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors",
                isCollapsed && "justify-center",
              )}
            >
              <LogOut className="w-5 h-5" />
              {!isCollapsed && <span className="text-sm">Logout</span>}
            </Link>
          </div>
        </div>
      </motion.aside>

      {/* Main content padding based on sidebar */}
      <div
        className={cn(
          "transition-all duration-300 ease-in-out",
          isCollapsed ? "ml-20" : "ml-0 md:ml-[280px]",
        )}
      />
    </>
  );
}
