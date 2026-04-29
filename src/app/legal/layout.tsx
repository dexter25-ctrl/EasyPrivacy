import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions Légales | EasyPrivacy",
  description: "Informations légales concernant l'éditeur et l'hébergeur de la plateforme EasyPrivacy.",
};

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
