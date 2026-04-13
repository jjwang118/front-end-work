"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isHoveringGitHub, setIsHoveringGitHub] = useState(false);
  const [isHoveringSubmit, setIsHoveringSubmit] = useState(false);
  async function getSupabase() {
    const { createBrowserSupabaseClient } = await import("@/lib/supabase/client");
    return createBrowserSupabaseClient();
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = await getSupabase();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      window.location.href = "/";
    }
  }

  async function handleGitHubLogin() {
    const supabase = await getSupabase();
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  return (
    <div className="flex min-h-[calc(100vh-64px-80px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-fade-slide-up">
        {/* Decorative top mark */}
        <div className="mb-8 flex items-center gap-4 animate-fade-slide-up delay-100">
          <div
            className="h-px flex-1 shimmer-line"
            style={{ background: "rgba(255,255,255,0.08)" }}
          />
          <span
            className="text-xs uppercase tracking-[0.3em]"
            style={{ color: "#9a948a", fontFamily: "var(--font-body)" }}
          >
            Welcome back
          </span>
          <div
            className="h-px flex-1"
            style={{ background: "rgba(255,255,255,0.08)" }}
          />
        </div>

        {/* Main card */}
        <div
          className="glass-card rounded-2xl p-8 hover-lift"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(24px)",
          }}
        >
          {/* Header */}
          <div className="mb-8 animate-fade-slide-up delay-200">
            <h1
              className="mb-2 text-4xl font-bold"
              style={{ fontFamily: "var(--font-display)", color: "#f5f0e8" }}
            >
              Sign In
            </h1>
            <p style={{ color: "#9a948a", fontFamily: "var(--font-body)" }}>
              Enter your credentials to access your account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5 animate-fade-slide-up delay-300">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-xs uppercase tracking-wider"
                style={{ color: "#9a948a" }}
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full rounded-lg px-4 py-3 text-sm transition-all focus:outline-none"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#f5f0e8",
                }}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(232,168,56,0.5)")
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")
                }
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-xs uppercase tracking-wider"
                style={{ color: "#9a948a" }}
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full rounded-lg px-4 py-3 text-sm transition-all focus:outline-none"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#f5f0e8",
                }}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(232,168,56,0.5)")
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")
                }
              />
            </div>

            {/* Error */}
            {error && (
              <div
                className="rounded-lg p-3 text-sm"
                style={{
                  background: "rgba(220, 38, 38, 0.1)",
                  border: "1px solid rgba(220, 38, 38, 0.2)",
                  color: "#fca5a5",
                }}
              >
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              onMouseEnter={() => setIsHoveringSubmit(true)}
              onMouseLeave={() => setIsHoveringSubmit(false)}
              className="w-full rounded-lg py-3 text-sm font-medium transition-all focus:outline-none"
              style={{
                background: isHoveringSubmit
                  ? "linear-gradient(135deg, #f0c060, #e8a838, #c4892a)"
                  : "#e8a838",
                color: "#0d0d0f",
                transform: isHoveringSubmit ? "translateY(-1px)" : "translateY(0)",
                boxShadow: isHoveringSubmit
                  ? "0 8px 32px rgba(232, 168, 56, 0.3)"
                  : "0 4px 16px rgba(232, 168, 56, 0.15)",
              }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Divider */}
          <div
            className="my-6 flex items-center gap-3"
          >
            <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
            <span className="text-xs" style={{ color: "#9a948a" }}>or</span>
            <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
          </div>

          {/* GitHub OAuth */}
          <button
            type="button"
            onClick={handleGitHubLogin}
            onMouseEnter={() => setIsHoveringGitHub(true)}
            onMouseLeave={() => setIsHoveringGitHub(false)}
            className="flex w-full items-center justify-center gap-3 rounded-lg py-3 text-sm transition-all focus:outline-none"
            style={{
              background: isHoveringGitHub ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#f5f0e8",
              transform: isHoveringGitHub ? "translateY(-1px)" : "translateY(0)",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            Continue with GitHub
          </button>
        </div>

        {/* Register link */}
        <p
          className="mt-6 text-center text-sm animate-fade-slide-up delay-400"
          style={{ color: "#9a948a" }}
        >
          Don&apos;t have an account?{" "}
          <a
            href="/auth/register"
            className="link-underline font-medium transition-colors"
            style={{ color: "#e8a838" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#f0c060")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#e8a838")}
          >
            Create one
          </a>
        </p>

        {/* Back to home */}
        <p
          className="mt-3 text-center text-xs animate-fade-slide-up delay-500"
          style={{ color: "#9a948a" }}
        >
          <a href="/" className="link-underline" style={{ color: "#9a948a" }}>
            Back to home
          </a>
        </p>
      </div>
    </div>
  );
}
