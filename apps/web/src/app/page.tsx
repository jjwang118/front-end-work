import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getPosts } from "@repo/database";
import { PostCard } from "@/components/post-card";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = await createServerSupabaseClient();
  const { data: posts } = await getPosts(supabase as any, { status: "published", limit: 12 });

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Hero section */}
      <div className="mb-16 animate-fade-slide-up">
        <div className="mb-4 flex items-center gap-2">
          <div
            className="h-1 w-8 rounded-full"
            style={{ background: "#e8a838" }}
          />
          <span
            className="text-xs uppercase tracking-[0.3em]"
            style={{ color: "#9a948a" }}
          >
            Curated Stories
          </span>
        </div>
        <h1
          className="mb-3 text-5xl font-bold leading-tight"
          style={{ fontFamily: "var(--font-display)", color: "#f5f0e8" }}
        >
          Where Ideas<br />
          <span style={{ color: "#e8a838" }}>Take Shape</span>
        </h1>
        <p
          className="max-w-lg text-lg"
          style={{ color: "#9a948a" }}
        >
          Thoughtfully curated stories, essays, and insights from our community of writers and thinkers.
        </p>
      </div>

      {/* Posts grid */}
      {posts && posts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post: any, i: number) => (
            <PostCard
              key={post.id}
              title={post.title}
              slug={post.slug}
              excerpt={post.excerpt}
              coverImage={post.cover_image}
              categoryName={post.categories?.name ?? null}
              authorName={post.profiles?.username ?? "Unknown"}
              publishedAt={post.published_at}
              index={i}
            />
          ))}
        </div>
      ) : (
        <div
          className="flex flex-col items-center justify-center rounded-2xl py-20 text-center"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div
            className="mb-4 flex h-16 w-16 items-center justify-center rounded-full"
            style={{ background: "rgba(232,168,56,0.1)" }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#e8a838" strokeWidth="1.5">
              <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
            </svg>
          </div>
          <p style={{ color: "#9a948a" }}>No stories published yet. Check back soon.</p>
        </div>
      )}
    </div>
  );
}
