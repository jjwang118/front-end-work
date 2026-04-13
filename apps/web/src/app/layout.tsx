import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
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

async function Header() {
  const { createServerSupabaseClient } = await import("@/lib/supabase/server");
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header
      className="relative z-10 border-b"
      style={{ borderColor: "rgba(255,255,255,0.06)" }}
    >
      <nav
        className="container mx-auto flex h-16 items-center justify-between px-6"
      >
        <a
          href="/"
          className="text-xl font-bold tracking-wide"
          style={{ fontFamily: "var(--font-display)", color: "#f5f0e8" }}
        >
          Inkwell
        </a>
        <div className="flex items-center gap-6">
          {user ? (
            <>
              <a
                href="/dashboard"
                className="text-sm transition-colors hover:text-amber"
                style={{ color: "#9a948a" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#e8a838")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#9a948a")}
              >
                Dashboard
              </a>
              <a
                href="https://front-end-work-admin.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm transition-colors hover:text-amber"
                style={{ color: "#9a948a" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#e8a838")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#9a948a")}
              >
                Admin Panel
              </a>
              <a
                href="/api/auth/signout"
                className="text-sm transition-colors"
                style={{
                  color: "#9a948a",
                  border: "1px solid rgba(255,255,255,0.1)",
                  padding: "6px 16px",
                  borderRadius: "6px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#e8a838";
                  e.currentTarget.style.borderColor = "rgba(232,168,56,0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#9a948a";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                }}
              >
                Sign Out
              </a>
            </>
          ) : (
            <>
              <a
                href="/auth/login"
                className="text-sm link-underline transition-colors"
                style={{ color: "#9a948a" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#e8a838")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#9a948a")}
              >
                Sign In
              </a>
              <a
                href="/auth/register"
                className="text-sm transition-colors"
                style={{
                  color: "#0d0d0f",
                  background: "#e8a838",
                  padding: "6px 16px",
                  borderRadius: "6px",
                  fontWeight: 500,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#f0c060")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#e8a838")}
              >
                Get Started
              </a>
            </>
          )}
        </div>
      </nav>
    </header>
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
