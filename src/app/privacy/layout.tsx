import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de Confidentialité | EasyPrivacy",
  description: "Transparence totale sur le traitement de vos données personnelles et l'utilisation de nos services tiers.",
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
