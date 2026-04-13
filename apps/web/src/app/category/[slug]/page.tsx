import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getCategoryBySlug, getPosts } from "@repo/database";
import { PostCard } from "@/components/post-card";

export const dynamic = "force-dynamic";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: category } = await getCategoryBySlug(supabase as any, slug);

  if (!category) {
    notFound();
  }

  const { data: posts } = await getPosts(supabase as any, { status: "published", categoryId: (category as any).id });

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-12 animate-fade-slide-up">
        <a
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm transition-colors"
          style={{ color: "#9a948a" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#e8a838")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#9a948a")}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          All stories
        </a>
        <div className="flex items-center gap-3 mb-3">
          <div
            className="h-1 w-8 rounded-full"
            style={{ background: "#e8a838" }}
          />
          <span
            className="text-xs uppercase tracking-[0.3em]"
            style={{ color: "#9a948a" }}
          >
            Category
          </span>
        </div>
        <h1
          className="text-4xl font-bold"
          style={{ fontFamily: "var(--font-display)", color: "#f5f0e8" }}
        >
          {(category as any).name}
        </h1>
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
              categoryName={null}
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
          <p style={{ color: "#9a948a" }}>No stories in this category yet.</p>
        </div>
      )}
    </div>
  );
}
