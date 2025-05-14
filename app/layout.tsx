
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { ClientProviders } from "@/components/client-providers";
import { MainNav } from "@/components/layouts/main-nav";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ASA ERP",
  description: "Modern ERP system for business management",
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
          <ClientProviders>
            <div className="flex h-screen">
              <MainNav />
              <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto p-6">
                  {children}
                </div>
              </main>
            </div>
            <Toaster />
          </ClientProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
