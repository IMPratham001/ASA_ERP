
import "@/styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

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
  const cookieStore = cookies();
  const token = cookieStore.get('token');
  const isAuthPage = children.props?.childProp?.segment === 'auth';

  if (!token && !isAuthPage) {
    redirect('/auth');
  }

  if (token && isAuthPage) {
    redirect('/dashboard');
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {!isAuthPage ? (
            <div className="flex min-h-screen">
              <Sidebar />
              <main className="flex-1 p-8">{children}</main>
            </div>
          ) : (
            children
          )}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
