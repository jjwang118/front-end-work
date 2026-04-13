import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import { Header } from "@/components/header";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Inkwell — Editorial Blog",
  description: "A curated editorial blog experience",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="min-h-screen" style={{ backgroundColor: "#0d0d0f", color: "#f5f0e8" }}>
        {/* Grain overlay */}
        <div className="grain-overlay" aria-hidden="true" />

        <div className="relative min-h-screen flex flex-col">
          {/* Ambient orbs */}
          <div className="ambient-orb ambient-orb-1" aria-hidden="true" />
          <div className="ambient-orb ambient-orb-2" aria-hidden="true" />

          <Header />
          <main className="flex-1 relative z-10">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}

function Footer() {
  return (
    <footer
      className="relative z-10 border-t py-8 text-center text-sm"
      style={{ borderColor: "rgba(255,255,255,0.06)", color: "#9a948a" }}
    >
      <p style={{ fontFamily: "var(--font-display)" }}>
        Inkwell — Where ideas take shape
      </p>
    </footer>
  );
}
