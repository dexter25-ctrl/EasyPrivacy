import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Expert | EasyPrivacy",
  description: "Accédez à votre plan d'action personnalisé, générez vos rapports PDF et pilotez votre mise en conformité RGPD.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
