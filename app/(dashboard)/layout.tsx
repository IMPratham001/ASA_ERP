
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex-1">{children}</div>
    </div>
  );
}
