"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Store,
  Users,
  Bell,
  Settings,
  CreditCard,
  FileText,
  BarChart3,
  LogOut,
} from "lucide-react";
import { useStore } from "@/lib/store/store";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const routes = [
  {
    label: "Help",
    icon: QuestionCircle,
    href: "/help",
    color: "text-purple-500",
    module: "help",
  },
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-sky-500",
    module: "dashboard",
  },
  {
    label: "Inventory",
    icon: Package,
    href: "/inventory",
    color: "text-violet-500",
    module: "inventory",
  },
  {
    label: "Orders",
    icon: ShoppingCart,
    href: "/orders",
    color: "text-pink-700",
    module: "orders",
  },
  {
    label: "Stores",
    icon: Store,
    href: "/stores",
    color: "text-orange-700",
    module: "stores",
  },
  {
    label: "Users",
    icon: Users,
    href: "/users",
    color: "text-green-700",
    module: "users",
  },
  {
    label: "Finance",
    icon: CreditCard,
    href: "/finance",
    color: "text-blue-700",
    module: "finance",
  },
  {
    label: "Reports",
    icon: FileText,
    href: "/reports",
    color: "text-purple-700",
    module: "reports",
  },
  {
    label: "Analytics",
    icon: BarChart3,
    href: "/analytics",
    color: "text-indigo-700",
    module: "analytics",
  },
];

export function MainNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, setUser, hasPermission } = useStore();

  const handleLogout = () => {
    setUser(null);
    router.push("/auth");
  };

  const filteredRoutes = routes.filter((route) =>
    hasPermission ? hasPermission(route.module, "view") : true
  );

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <span className="font-bold text-xl">ERP System</span>
          </Link>
          <nav className="flex items-center space-x-4 lg:space-x-6" role="navigation" aria-label="Main">
            {filteredRoutes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === route.href
                    ? "text-black dark:text-white"
                    : "text-muted-foreground"
                )}
              >
                <div className="flex items-center gap-x-2">
                  <route.icon className={cn("h-4 w-4", route.color)} />
                  {route.label}
                </div>
              </Link>
            ))}
          </nav>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 bg-red-600 rounded-full" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Settings"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span>{user?.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {user?.email}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}