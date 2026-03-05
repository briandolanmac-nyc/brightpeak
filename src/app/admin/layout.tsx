export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin - BrightPeak Energy",
  robots: "noindex, nofollow",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
