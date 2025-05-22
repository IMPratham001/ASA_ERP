
'use client';

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  HomeIcon,
  PersonIcon,
  ReaderIcon,
  GearIcon,
  BarChartIcon,
  LayersIcon,
  CubeIcon,
  FileIcon,
  ClockIcon
} from "@radix-ui/react-icons";

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Customers', href: '/customers', icon: PersonIcon },
  { name: 'Inventory', href: '/inventory', icon: CubeIcon },
  { name: 'Orders', href: '/custom-orders', icon: LayersIcon },
  { name: 'Finance', href: '/finance/reports', icon: BarChartIcon },
  { name: 'Documents', href: '/documents', icon: FileIcon },
  { name: 'Time Tracking', href: '/time-tracking', icon: ClockIcon },
  { name: 'Reports', href: '/reports', icon: ReaderIcon },
  { name: 'Settings', href: '/settings', icon: GearIcon },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
      <div className="flex h-full flex-col gap-2">
        <div className="flex-1 space-y-1 p-4">
          {navigation.map((item) => {
            const isActive = pathname?.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
                  isActive 
                    ? "bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-gray-50"
                    : "text-gray-700 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-800"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
