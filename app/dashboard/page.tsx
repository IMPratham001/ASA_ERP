"use client";
import React, { useState, useEffect } from "react";
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
  Globe,
  ChevronRight,
  Bell,
  Search,
  Zap,
  Menu,
  X,
  Home,
  Star,
  TrendingUp,
  Check,
} from "lucide-react";

// Sample store data - in a real app, this would come from an API
const stores = [
  {
    id: "store-ny",
    name: "New York Store",
    country: "USA",
    icon: "🇺🇸",
    metrics: { revenue: "+12%", customers: "504", pending: 7 },
    theme: "from-blue-600 to-indigo-600",
  },
  {
    id: "store-ln",
    name: "London Store",
    country: "UK",
    icon: "🇬🇧",
    metrics: { revenue: "+5%", customers: "320", pending: 3 },
    theme: "from-emerald-600 to-teal-600",
  },
  {
    id: "store-tk",
    name: "Tokyo Store",
    country: "Japan",
    icon: "🇯🇵",
    metrics: { revenue: "+18%", customers: "412", pending: 9 },
    theme: "from-violet-600 to-purple-600",
  },
  {
    id: "store-sp",
    name: "Singapore Store",
    country: "Singapore",
    icon: "🇸🇬",
    metrics: { revenue: "+8%", customers: "256", pending: 5 },
    theme: "from-rose-600 to-pink-600",
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [expandedSettings, setExpandedSettings] = useState(
    pathname.includes("/settings"),
  );
  const [expandedStores, setExpandedStores] = useState(false);
  const [activeStore, setActiveStore] = useState(stores[0]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState(3);
  const [quickActions, setQuickActions] = useState(false);

  // Routes configuration - dynamic based on active store
  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: `/stores/${activeStore.id}/dashboard`,
      color: "text-blue-600",
      badge: activeStore.metrics.revenue,
    },
    {
      label: "Customers",
      icon: Users,
      href: `/stores/${activeStore.id}/customers`,
      color: "text-emerald-600",
      badge: activeStore.metrics.customers,
    },
    {
      label: "Items",
      icon: Package,
      href: `/stores/${activeStore.id}/items`,
      color: "text-violet-600",
    },
    {
      label: "Invoices",
      icon: FileText,
      href: `/stores/${activeStore.id}/invoices`,
      color: "text-indigo-600",
      badge: activeStore.metrics.pending,
    },
    {
      label: "Payments Received",
      icon: CreditCard,
      href: `/stores/${activeStore.id}/payments`,
      color: "text-amber-600",
    },
    {
      label: "Expenses",
      icon: CreditCard,
      href: `/stores/${activeStore.id}/expenses`,
      color: "text-rose-600",
    },
    {
      label: "Time Tracking",
      icon: Clock,
      href: `/stores/${activeStore.id}/time-tracking`,
      color: "text-teal-600",
    },
    {
      label: "Reports",
      icon: BarChart2,
      href: `/stores/${activeStore.id}/reports`,
      color: "text-sky-600",
    },
    {
      label: "Settings",
      icon: Settings,
      href: `/stores/${activeStore.id}/settings`,
      color: "text-slate-600",
      subItems: [
        {
          label: "Profile",
          icon: User,
          href: `/stores/${activeStore.id}/settings/profile`,
          color: "text-slate-600",
        },
        {
          label: "Security",
          icon: Lock,
          href: `/stores/${activeStore.id}/settings/security`,
          color: "text-slate-600",
        },
      ],
    },
  ];

  // Filter routes based on search
  const filteredRoutes = searchQuery
    ? routes.filter((route) =>
        route.label.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : routes;

  // Effect to close mobile menu when path changes
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Toggle quick actions
  const toggleQuickActions = () => {
    setQuickActions(!quickActions);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-lg shadow-md border border-slate-200"
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div
        className={cn(
          "side-nav bg-white border-r border-slate-200 h-screen fixed left-0 top-0 z-40 transition-transform duration-300 shadow-lg overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 w-72",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="p-6">
          {/* Logo and Brand */}
          <div className="flex items-center gap-2 mb-6">
            <div
              className={`bg-gradient-to-r ${activeStore.theme} rounded-lg p-2.5 shadow-lg`}
            >
              <FileText className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-800">ASA-ERP</span>

            {/* Notification Button */}
            <div className="ml-auto relative">
              <button className="p-1.5 hover:bg-slate-100 rounded-full transition-colors relative">
                <Bell className="h-5 w-5 text-slate-600" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-xs text-white rounded-full h-4 w-4 flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Store Selector */}
          <div className="mb-6">
            <button
              onClick={() => setExpandedStores(!expandedStores)}
              className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg p-3 flex items-center justify-between transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <div className="text-xl">{activeStore.icon}</div>
                <div>
                  <div className="font-medium text-slate-800">
                    {activeStore.name}
                  </div>
                  <div className="text-xs text-slate-500">
                    {activeStore.country}
                  </div>
                </div>
              </div>
              <ChevronDown
                className={cn(
                  "h-5 w-5 text-slate-500 transition-transform duration-300",
                  expandedStores ? "rotate-180" : "",
                )}
              />
            </button>

            {/* Store Dropdown */}
            {expandedStores && (
              <div className="mt-2 bg-white border border-slate-200 rounded-lg shadow-lg p-2 space-y-1 animate-fadeIn">
                {stores.map((store) => (
                  <button
                    key={store.id}
                    onClick={() => {
                      setActiveStore(store);
                      setExpandedStores(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 p-2.5 rounded-md transition-colors",
                      activeStore.id === store.id
                        ? `bg-gradient-to-r ${store.theme} text-white`
                        : "hover:bg-slate-50 text-slate-700",
                    )}
                  >
                    <div className="text-xl">{store.icon}</div>
                    <div className="text-left">
                      <div
                        className={cn(
                          "font-medium",
                          activeStore.id === store.id
                            ? "text-white"
                            : "text-slate-800",
                        )}
                      >
                        {store.name}
                      </div>
                      <div
                        className={cn(
                          "text-xs",
                          activeStore.id === store.id
                            ? "text-white text-opacity-90"
                            : "text-slate-500",
                        )}
                      >
                        {store.country}
                      </div>
                    </div>
                    {activeStore.id === store.id && (
                      <div className="ml-auto">
                        <div className="bg-white bg-opacity-25 h-5 w-5 rounded-full flex items-center justify-center">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      </div>
                    )}
                  </button>
                ))}
                <Link
                  href="/stores/manage"
                  className="w-full flex items-center gap-2 p-2.5 text-slate-600 hover:bg-slate-50 rounded-md"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span className="text-sm">Add New Store</span>
                </Link>
              </div>
            )}
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X className="h-4 w-4 text-slate-400 hover:text-slate-600" />
              </button>
            )}
          </div>

          {/* Quick Actions Button */}
          <div className="mb-6">
            <button
              onClick={toggleQuickActions}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg p-3 flex items-center justify-between transition-all group"
            >
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-white" />
                <span className="font-medium">Quick Actions</span>
              </div>
              <ChevronRight
                className={cn(
                  "h-5 w-5 text-white transition-transform duration-300",
                  quickActions ? "rotate-90" : "group-hover:translate-x-1",
                )}
              />
            </button>

            {/* Quick Actions Panel */}
            {quickActions && (
              <div className="mt-2 grid grid-cols-2 gap-2 animate-fadeIn">
                <Link
                  href={`/stores/${activeStore.id}/create-invoice`}
                  className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 p-3 rounded-lg flex flex-col items-center justify-center transition-colors text-center"
                >
                  <FileText className="h-6 w-6 mb-1" />
                  <span className="text-xs font-medium">New Invoice</span>
                </Link>
                <Link
                  href={`/stores/${activeStore.id}/add-customer`}
                  className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 p-3 rounded-lg flex flex-col items-center justify-center transition-colors text-center"
                >
                  <Users className="h-6 w-6 mb-1" />
                  <span className="text-xs font-medium">Add Customer</span>
                </Link>
                <Link
                  href={`/stores/${activeStore.id}/add-item`}
                  className="bg-violet-50 hover:bg-violet-100 text-violet-700 p-3 rounded-lg flex flex-col items-center justify-center transition-colors text-center"
                >
                  <Package className="h-6 w-6 mb-1" />
                  <span className="text-xs font-medium">New Item</span>
                </Link>
                <Link
                  href={`/stores/${activeStore.id}/add-expense`}
                  className="bg-rose-50 hover:bg-rose-100 text-rose-700 p-3 rounded-lg flex flex-col items-center justify-center transition-colors text-center"
                >
                  <CreditCard className="h-6 w-6 mb-1" />
                  <span className="text-xs font-medium">Log Expense</span>
                </Link>
              </div>
            )}
          </div>

          {/* Store Stats Summary */}
          <div className="mb-6 p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="text-sm font-medium text-slate-700 mb-2 flex items-center justify-between">
              <span>{activeStore.name} Stats</span>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white p-2 rounded border border-slate-200">
                <div className="text-xs text-slate-500">Revenue</div>
                <div className="text-sm font-semibold text-green-600">
                  {activeStore.metrics.revenue}
                </div>
              </div>
              <div className="bg-white p-2 rounded border border-slate-200">
                <div className="text-xs text-slate-500">Customers</div>
                <div className="text-sm font-semibold text-blue-600">
                  {activeStore.metrics.customers}
                </div>
              </div>
              <div className="bg-white p-2 rounded border border-slate-200">
                <div className="text-xs text-slate-500">Pending</div>
                <div className="text-sm font-semibold text-amber-600">
                  {activeStore.metrics.pending}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1 mb-8">
            {filteredRoutes.map((route) => {
              if (route.subItems) {
                return (
                  <div key={route.href} className="space-y-1">
                    <button
                      onClick={() => setExpandedSettings(!expandedSettings)}
                      className={cn(
                        "w-full flex items-center justify-between gap-x-2 text-sm font-medium px-3 py-2.5 rounded-lg transition-all hover:shadow-sm",
                        pathname.includes(route.href)
                          ? "bg-gradient-to-r from-slate-100 to-slate-200 text-slate-900"
                          : "hover:bg-slate-50 text-slate-700",
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "h-8 w-8 rounded-lg flex items-center justify-center",
                            pathname.includes(route.href)
                              ? `bg-gradient-to-r ${activeStore.theme} shadow-sm`
                              : "bg-slate-100",
                          )}
                        >
                          <route.icon
                            className={cn(
                              "h-4 w-4",
                              pathname.includes(route.href)
                                ? "text-white"
                                : route.color,
                            )}
                          />
                        </div>
                        {route.label}
                      </div>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 text-slate-500 transition-transform duration-300",
                          expandedSettings ? "rotate-180" : "",
                        )}
                      />
                    </button>

                    {expandedSettings && (
                      <div className="pl-11 space-y-1 pt-1 animate-slideDown">
                        {route.subItems.map((subItem) => (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className={cn(
                              "flex items-center gap-x-3 text-sm font-medium px-3 py-2 rounded-lg transition-colors",
                              pathname === subItem.href
                                ? "bg-slate-100 text-slate-900"
                                : "hover:bg-slate-50 text-slate-600 hover:text-slate-900",
                            )}
                          >
                            <subItem.icon
                              className={cn(
                                "h-4 w-4",
                                pathname === subItem.href
                                  ? route.color
                                  : "text-slate-400",
                              )}
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
                    "flex items-center gap-x-3 text-sm font-medium px-3 py-2.5 rounded-lg transition-all hover:shadow-sm group",
                    pathname === route.href
                      ? "bg-gradient-to-r from-slate-100 to-slate-200 text-slate-900"
                      : "hover:bg-slate-50 text-slate-700",
                  )}
                >
                  <div
                    className={cn(
                      "h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-300",
                      pathname === route.href
                        ? `bg-gradient-to-r ${activeStore.theme} shadow-sm`
                        : "bg-slate-100 group-hover:bg-slate-200",
                    )}
                  >
                    <route.icon
                      className={cn(
                        "h-4 w-4",
                        pathname === route.href ? "text-white" : route.color,
                      )}
                    />
                  </div>
                  {route.label}
                  {route.badge && (
                    <span
                      className={cn(
                        "ml-auto text-xs rounded-full px-2 py-0.5 flex items-center justify-center",
                        typeof route.badge === "string" &&
                          route.badge.indexOf("+") >= 0
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700",
                      )}
                    >
                      {route.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            {searchQuery && filteredRoutes.length === 0 && (
              <div className="text-center py-4 text-slate-500 text-sm">
                No menu items found for "{searchQuery}"
              </div>
            )}
          </nav>

          {/* Create Invoice Button */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <Link
              href={`/stores/${activeStore.id}/create-invoice`}
              className={`flex items-center gap-x-2 text-sm font-medium bg-gradient-to-r ${activeStore.theme} hover:shadow-lg text-white px-4 py-3 rounded-lg transition-all w-full justify-center`}
            >
              <PlusCircle className="h-5 w-5" />
              Create New Invoice
            </Link>
          </div>

          {/* User Profile Preview */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-medium">
                JS
              </div>
              <div>
                <div className="text-sm font-medium text-slate-800">
                  John Smith
                </div>
                <div className="text-xs text-slate-500">Store Manager</div>
              </div>
              <Link
                href="/profile"
                className="ml-auto p-1.5 hover:bg-slate-100 rounded-full transition-colors"
              >
                <Settings className="h-4 w-4 text-slate-500" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-in-out;
        }

        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }

        .scrollbar-thumb-slate-300::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 3px;
        }

        .scrollbar-track-slate-100::-webkit-scrollbar-track {
          background-color: #f1f5f9;
        }
      `}</style>
    </>
  );
}
