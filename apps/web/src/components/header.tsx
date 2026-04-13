"use client";

import { useEffect, useState } from "react";

interface UserInfo {
  email: string;
  username: string;
}

export function Header() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const { createBrowserSupabaseClient } = await import("@/lib/supabase/client");
        const supabase = createBrowserSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const meta = user.user_metadata as any;
          setUser({
            email: user.email ?? "",
            username: meta?.username || meta?.full_name || user.email?.split("@")[0] || "Reader",
          });
        }
      } catch {
        // Not authenticated — show unauthenticated UI
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  return (
    <header
      className="relative z-10 border-b"
      style={{ borderColor: "rgba(255,255,255,0.06)" }}
    >
      <nav className="container mx-auto flex h-16 items-center justify-between px-6">
        <a
          href="/"
          className="header-logo text-xl font-bold tracking-wide transition-colors"
          style={{ fontFamily: "var(--font-display)", color: "#f5f0e8" }}
        >
          Inkwell
        </a>

        <div className="flex items-center gap-6">
          {!loading && user ? (
            <>
              <a
                href="/dashboard"
                className="header-nav-link text-sm transition-colors"
                style={{ color: "#9a948a" }}
              >
                Dashboard
              </a>
              <a
                href="https://front-end-work-admin.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="header-nav-link text-sm transition-colors"
                style={{ color: "#9a948a" }}
              >
                Admin Panel
              </a>
              <a
                href="/api/auth/signout"
                className="header-btn-outline text-sm transition-all"
                style={{
                  color: "#9a948a",
                  border: "1px solid rgba(255,255,255,0.1)",
                  padding: "6px 16px",
                  borderRadius: "6px",
                }}
              >
                Sign Out
              </a>
            </>
          ) : !loading ? (
            <>
              <a
                href="/auth/login"
                className="header-nav-link text-sm transition-colors"
                style={{ color: "#9a948a" }}
              >
                Sign In
              </a>
              <a
                href="/auth/register"
                className="header-nav-link text-sm font-medium transition-colors"
                style={{
                  color: "#0d0d0f",
                  background: "#e8a838",
                  padding: "6px 16px",
                  borderRadius: "6px",
                }}
              >
                Get Started
              </a>
            </>
          ) : null}
        </div>
      </nav>
    </header>
  );
}
