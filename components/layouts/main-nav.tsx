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
  Store,
  Calculator,
  BarChart2,
  CreditCard,
  LogOut,
  LogIn,
  HelpCircle,
  BookOpen,
  Building2,
  Receipt,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/store/store";
import { Separator } from "@/components/ui/separator";

const getNavItems = (role: string) => {
  const baseItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      roles: ["owner", "admin", "sales", "accountant"],
    },
  ];

  const roleSpecificItems = {
    owner: [
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
        title: "Orders",
        href: "/orders",
        icon: ShoppingCart,
      },
      {
        title: "Invoices",
        href: "/invoices",
        icon: Receipt,
      },
      {
        title: "Stores",
        href: "/stores",
        icon: Store,
      },
      {
        title: "Users",
        href: "/users",
        icon: Building2,
      },
      {
        title: "Finance",
        href: "/finance",
        icon: Calculator,
      },
      {
        title: "Reports",
        href: "/reports",
        icon: BarChart2,
      },
    ],
    sales: [
      {
        title: "Customers",
        href: "/customers",
        icon: Users,
      },
      {
        title: "Orders",
        href: "/orders",
        icon: ShoppingCart,
      },
      {
        title: "Invoices",
        href: "/invoices",
        icon: Receipt,
      },
    ],
    accountant: [
      {
        title: "Finance",
        href: "/finance",
        icon: Calculator,
      },
      {
        title: "Reports",
        href: "/reports",
        icon: BarChart2,
      },
      {
        title: "Invoices",
        href: "/invoices",
        icon: Receipt,
      },
    ],
  };

  return [
    ...baseItems,
    ...(roleSpecificItems[role as keyof typeof roleSpecificItems] || []),
  ];
};

const helpNavItems = [
  {
    title: "User Manual",
    href: "/help/manual",
    icon: BookOpen,
  },
];

export function MainNav() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const handleLogout = () => {
    setUser(null);
    router.push("/auth");
  };

  if (!user) {
    return (
      <div className="flex justify-end p-4">
        <Button onClick={() => router.push("/auth")}>
          <LogIn className="h-4 w-4 mr-2" />
          Login
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <Store className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          <span className="text-lg font-semibold">ASA ERP</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        {user &&
          getNavItems(user.role).map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 rounded-lg transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700",
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 mr-3",
                    isActive
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-500 dark:text-gray-400",
                  )}
                />
                <span className="text-sm font-medium">{item.title}</span>
              </Link>
            );
          })}

        <Separator className="my-2" />

        {helpNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 rounded-lg transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700",
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 mr-3",
                  isActive
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-500 dark:text-gray-400",
                )}
              />
              <span className="text-sm font-medium">{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {user && (
        <div className="mt-auto">
          <Separator className="my-2" />
          <div className="p-4">
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="ml-2 space-y-1">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user.email}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                    Role: {user.role}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push("/settings/profile")}
                >
                  <User className="mr-2 h-4 w-4" />
                  Manage Profile
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
