import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Junaid Ahmed | Internship Dashboard",
  description: "AI-Powered Internship Career Dashboard for Junaid Ahmed. Tracks applications, optimizes resume variants, and automates outreach.",
  manifest: "/manifest.json",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png"
  }
};

export const viewport: Viewport = {
  themeColor: "#060913"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col bg-[#060913]">
        {children}
      </body>
    </html>
  );
}
