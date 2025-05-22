'use client';

import "@/styles/globals.css";
import { Inter } from "next/font/google";
import dynamic from 'next/dynamic';
import { Suspense, lazy } from 'react';
import { Loading } from '@/components/ui/loading';

const Sidebar = dynamic(() => import("@/components/layout/sidebar"), {
  loading: () => <Loading />,
  ssr: false
});

const ThemeProvider = dynamic(() => import("@/components/shared/theme-provider"), {
  ssr: true
});

const Toaster = dynamic(() => import("@/components/ui/toaster"), {
  ssr: false
});

const ErrorBoundary = dynamic(() => import("@/components/shared/error-boundary"), {
  ssr: true
});
import { cookies } from 'next/headers';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ErrorBoundary>
            <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
              <Sidebar />
              <div className="flex-1">
                <main className="h-screen overflow-y-auto p-4 md:p-8">
                  {children}
                </main>
              </div>
            </div>
            <Toaster />
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}