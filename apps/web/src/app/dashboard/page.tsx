import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getPosts } from "@repo/database";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p style={{ color: "#9a948a" }}>Redirecting to login...</p>
      </div>
    );
  }

  const { data: posts } = await getPosts(supabase as any, { status: "published", limit: 6 });
  const username = (user as any)?.user_metadata?.username
    || (user as any)?.user_metadata?.full_name
    || user.email?.split("@")[0]
    || "Reader";

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Greeting section */}
      <div className="mb-12 animate-fade-slide-up">
        <div className="mb-2 flex items-center gap-2">
          <div
            className="h-1 w-8 rounded-full"
            style={{ background: "#e8a838" }}
          />
          <span
            className="text-xs uppercase tracking-[0.3em]"
            style={{ color: "#9a948a" }}
          >
            Personal Hub
          </span>
        </div>
        <h1
          className="mb-2 text-5xl font-bold"
          style={{ fontFamily: "var(--font-display)", color: "#f5f0e8" }}
        >
          Good day, {username}
        </h1>
        <p style={{ color: "#9a948a", maxWidth: "480px" }}>
          Welcome back to your editorial space. Discover the latest stories, manage your content, and explore what&apos;s new.
        </p>
      </div>

      {/* Quick actions */}
      <div className="mb-12 grid gap-4 sm:grid-cols-3 animate-fade-slide-up delay-100">
        {/* Admin Panel Card */}
        <a
          href="https://front-end-work-admin.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="glass-card rounded-2xl p-6 transition-all hover-lift group"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(24px)",
          }}
        >
          <div
            className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-colors"
            style={{ background: "rgba(232,168,56,0.1)" }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e8a838" strokeWidth="1.5">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
            </svg>
          </div>
          <h3
            className="mb-1 text-lg font-bold"
            style={{ fontFamily: "var(--font-display)", color: "#f5f0e8" }}
          >
            Admin Panel
          </h3>
          <p className="text-sm" style={{ color: "#9a948a" }}>
            Manage posts, comments, and media
          </p>
          <div className="mt-4 flex items-center gap-1 text-xs" style={{ color: "#e8a838" }}>
            <span>Open admin</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </div>
        </a>

        {/* Browse Posts Card */}
        <a
          href="/"
          className="glass-card rounded-2xl p-6 transition-all hover-lift group"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(24px)",
          }}
        >
          <div
            className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-colors"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f5f0e8" strokeWidth="1.5">
              <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
            </svg>
          </div>
          <h3
            className="mb-1 text-lg font-bold"
            style={{ fontFamily: "var(--font-display)", color: "#f5f0e8" }}
          >
            Browse Stories
          </h3>
          <p className="text-sm" style={{ color: "#9a948a" }}>
            Explore the latest articles and posts
          </p>
          <div className="mt-4 flex items-center gap-1 text-xs" style={{ color: "#9a948a" }}>
            <span>View all</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </div>
        </a>

        {/* User Profile Card */}
        <div
          className="glass-card rounded-2xl p-6 transition-all hover-lift"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(24px)",
          }}
        >
          <div
            className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
            style={{ background: "rgba(232,168,56,0.1)" }}
          >
            <span
              className="text-lg font-bold"
              style={{ color: "#e8a838", fontFamily: "var(--font-display)" }}
            >
              {username[0]?.toUpperCase()}
            </span>
          </div>
          <h3
            className="mb-1 text-lg font-bold"
            style={{ fontFamily: "var(--font-display)", color: "#f5f0e8" }}
          >
            {username}
          </h3>
          <p className="mb-4 truncate text-sm" style={{ color: "#9a948a" }}>
            {user.email}
          </p>
          <div
            className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs"
            style={{ background: "rgba(232,168,56,0.1)", color: "#e8a838" }}
          >
            <div
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: "#4ade80" }}
            />
            Active member
          </div>
        </div>
      </div>

      {/* Recent Posts */}
      <div className="animate-fade-slide-up delay-200">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="h-px w-8 rounded-full"
              style={{ background: "#e8a838" }}
            />
            <h2
              className="text-2xl font-bold"
              style={{ fontFamily: "var(--font-display)", color: "#f5f0e8" }}
            >
              Recent Stories
            </h2>
          </div>
          <a
            href="/"
            className="text-sm transition-colors"
            style={{ color: "#9a948a" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#e8a838")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#9a948a")}
          >
            View all →
          </a>
        </div>

        {posts && posts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post: any, i: number) => (
              <Link
                key={post.id}
                href={`/${post.slug}`}
                className="glass-card group rounded-2xl overflow-hidden transition-all hover-lift"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  backdropFilter: "blur(16px)",
                  animationDelay: `${300 + i * 80}ms`,
                  animation: "fadeSlideUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards",
                  opacity: 0,
                }}
              >
                {/* Cover */}
                {post.cover_image && (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={post.cover_image}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-5">
                  {post.categories?.name && (
                    <span
                      className="mb-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium"
                      style={{
                        background: "rgba(232,168,56,0.1)",
                        color: "#e8a838",
                      }}
                    >
                      {post.categories.name}
                    </span>
                  )}
                  <h3
                    className="mb-2 text-lg font-bold leading-snug transition-colors group-hover:text-amber"
                    style={{ fontFamily: "var(--font-display)", color: "#f5f0e8" }}
                  >
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p
                      className="mb-3 line-clamp-2 text-sm leading-relaxed"
                      style={{ color: "#9a948a" }}
                    >
                      {post.excerpt}
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-xs" style={{ color: "#9a948a" }}>
                    <span>{post.profiles?.username ?? "Unknown"}</span>
                    {post.published_at && (
                      <>
                        <span>·</span>
                        <span>{new Date(post.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                      </>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center rounded-2xl py-16 text-center"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <p style={{ color: "#9a948a" }}>No stories published yet.</p>
          </div>
        )}
      </div>

      {/* Stats row */}
      <div className="mt-16 grid gap-4 sm:grid-cols-4 animate-fade-slide-up delay-400">
        {[
          { label: "Articles Read", value: "24", icon: "📖" },
          { label: "Comments", value: "8", icon: "💬" },
          { label: "Bookmarks", value: "3", icon: "🔖" },
          { label: "Days Active", value: "12", icon: "📅" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="glass-card rounded-xl p-4 text-center"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div className="mb-2 text-2xl">{stat.icon}</div>
            <div
              className="text-2xl font-bold"
              style={{ fontFamily: "var(--font-display)", color: "#e8a838" }}
            >
              {stat.value}
            </div>
            <div className="text-xs" style={{ color: "#9a948a" }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
