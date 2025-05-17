
import "@/styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Sidebar } from "@/components/layout/main-nav";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { UserGuide } from "@/components/shared/user-guide";
import ErrorBoundary from "@/components/shared/error-boundary";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ASA-ERP",
  description: "Advanced ERP System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
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
            <UserGuide />
            <Toaster />
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}
