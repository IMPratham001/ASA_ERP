
import { MainNav } from "@/components/layout/main-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <MainNav />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
