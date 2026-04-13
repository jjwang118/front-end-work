"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isHoveringSubmit, setIsHoveringSubmit] = useState(false);

  async function getSupabase() {
    const { createBrowserSupabaseClient } = await import("@/lib/supabase/client");
    return createBrowserSupabaseClient();
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = await getSupabase();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      setSuccess(true);
    }
    setLoading(false);
  }

  if (success) {
    return (
      <div className="flex min-h-[calc(100vh-64px-80px)] items-center justify-center px-4">
        <div
          className="w-full max-w-md rounded-2xl p-8 text-center animate-fade-slide-up"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(24px)",
          }}
        >
          <div
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
            style={{ background: "rgba(232,168,56,0.1)" }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#e8a838" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>
          <h2
            className="mb-2 text-2xl font-bold"
            style={{ fontFamily: "var(--font-display)", color: "#f5f0e8" }}
          >
            Check your email
          </h2>
          <p style={{ color: "#9a948a" }}>
            We sent you a confirmation link. Please check your inbox to verify your account.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-64px-80px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-fade-slide-up">
        {/* Decorative top mark */}
        <div className="mb-8 flex items-center gap-4 animate-fade-slide-up delay-100">
          <div
            className="h-px flex-1"
            style={{ background: "rgba(255,255,255,0.08)" }}
          />
          <span
            className="text-xs uppercase tracking-[0.3em]"
            style={{ color: "#9a948a" }}
          >
            Begin your journey
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
              Create Account
            </h1>
            <p style={{ color: "#9a948a" }}>
              Join the community and start your writing journey
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-5 animate-fade-slide-up delay-300">
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="mb-2 block text-xs uppercase tracking-wider"
                style={{ color: "#9a948a" }}
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="yourname"
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
                minLength={6}
                placeholder="Min 6 characters"
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
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>
        </div>

        {/* Login link */}
        <p
          className="mt-6 text-center text-sm animate-fade-slide-up delay-400"
          style={{ color: "#9a948a" }}
        >
          Already have an account?{" "}
          <a
            href="/auth/login"
            className="link-underline font-medium transition-colors"
            style={{ color: "#e8a838" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#f0c060")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#e8a838")}
          >
            Sign in
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
