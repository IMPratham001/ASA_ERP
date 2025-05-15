
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Settings,
  LogOut
} from "lucide-react";

export function MainNav() {
  const pathname = usePathname();
  const isAuthPage = pathname === '/auth';

  if (isAuthPage) return null;

  return (
    <div className="border-r bg-gray-100/40 w-64 space-y-4 p-4">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">ASA-ERP</h2>
        <nav className="space-y-2">
          <Link href="/dashboard">
            <Button
              variant={pathname === '/dashboard' ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <Link href="/settings">
            <Button
              variant={pathname.startsWith('/settings') ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </Link>
          <form action="/api/auth/logout" method="POST">
            <Button
              type="submit"
              variant="ghost"
              className="w-full justify-start text-red-500 hover:text-red-600"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </form>
        </nav>
      </div>
    </div>
  );
}
