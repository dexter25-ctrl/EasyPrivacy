import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog Expert RGPD & Privacy | EasyPrivacy",
  description: "Dossiers exclusifs, analyses de risques et conseils d'experts pour sécuriser votre plateforme contre les amendes de la CNIL.",
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
