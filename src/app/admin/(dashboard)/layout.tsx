import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const metadata = {
  title: "Admin — Portofolio CMS",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream text-ink">
      <div className="flex min-h-screen flex-col md:flex-row">
        <AdminSidebar />
        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-10 md:px-10">{children}</main>
      </div>
    </div>
  );
}