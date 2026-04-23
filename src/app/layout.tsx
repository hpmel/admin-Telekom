import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Écono Télékom CRM — Tour de contrôle",
  description:
    "CRM/TEM sur mesure pour Écono Télékom. Centralisez vos clients, automatisez votre facturation et optimisez vos opérations télécoms.",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <TooltipProvider delayDuration={300}>
          {children}
        </TooltipProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
