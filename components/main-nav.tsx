'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Home,
  Users,
  Package,
  FileText,
  CreditCard,
  Clock,
  BarChart2,
  Settings,
  ChevronDown,
  PlusCircle
} from 'lucide-react';

const routes = [
  {
    label: 'Getting Started',
    icon: Home,
    href: '/getting-started',
    color: 'text-sky-500'
  },
  {
    label: 'Home',
    icon: Home,
    href: '/home',
    color: 'text-sky-500',
    badge: 1
  },
  {
    label: 'Customers',
    icon: Users,
    href: '/customers',
    color: 'text-orange-500'
  },
  {
    label: 'Items',
    icon: Package,
    href: '/items',
    color: 'text-violet-500'
  },
  {
    label: 'Quotes',
    icon: FileText,
    href: '/quotes',
    color: 'text-pink-700'
  },
  {
    label: 'Delivery Challans',
    icon: FileText,
    href: '/delivery-challans',
    color: 'text-green-700'
  },
  {
    label: 'Invoices',
    icon: FileText,
    href: '/invoices',
    color: 'text-blue-700'
  },
  {
    label: 'Payments Received',
    icon: CreditCard,
    href: '/payments',
    color: 'text-purple-700'
  },
  {
    label: 'Expenses',
    icon: CreditCard,
    href: '/expenses',
    color: 'text-yellow-700'
  },
  {
    label: 'Time Tracking',
    icon: Clock,
    href: '/time-tracking',
    color: 'text-indigo-700'
  },
  {
    label: 'Reports',
    icon: BarChart2,
    href: '/reports',
    color: 'text-red-700'
  }
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <div className="side-nav">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <FileText className="h-8 w-8" />
          <span className="font-bold text-xl">Invoice</span>
        </div>
        <nav className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                'flex items-center gap-x-2 text-sm font-medium px-3 py-2 rounded-lg transition-colors',
                pathname === route.href 
                  ? 'bg-accent text-primary' 
                  : 'hover:bg-accent hover:text-primary text-muted-foreground'
              )}
            >
              <route.icon className={cn('h-4 w-4', route.color)} />
              {route.label}
              {route.badge && (
                <span className="ml-auto bg-primary text-xs text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center">
                  {route.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}