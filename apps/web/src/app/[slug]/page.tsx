import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getPostBySlug } from "@repo/database";
import { MarkdownRenderer } from "@repo/ui";
import { CommentSection } from "@/components/comment-section";

export const dynamic = "force-dynamic";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();
  const { data } = await getPostBySlug(supabase as any, slug);
  const post = data as any;

  if (!post || post.status !== "published") {
    notFound();
  }

  return (
    <article className="container mx-auto max-w-3xl px-6 py-12">
      {/* Back link */}
      <a
        href="/"
        className="mb-8 inline-flex items-center gap-2 text-sm transition-colors"
        style={{ color: "#9a948a" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#e8a838")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#9a948a")}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        Back to stories
      </a>

      {/* Cover */}
      {post.cover_image && (
        <div className="mb-10 aspect-video overflow-hidden rounded-2xl animate-fade-slide-up">
          <img
            src={post.cover_image}
            alt={post.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      {/* Header */}
      <header className="mb-10 animate-fade-slide-up delay-100">
        {post.categories?.name && (
          <span
            className="mb-4 inline-block rounded-full px-3 py-1 text-xs font-medium"
            style={{ background: "rgba(232,168,56,0.1)", color: "#e8a838" }}
          >
            {post.categories.name}
          </span>
        )}
        <h1
          className="mb-6 text-4xl font-bold leading-tight md:text-5xl"
          style={{ fontFamily: "var(--font-display)", color: "#f5f0e8" }}
        >
          {post.title}
        </h1>
        <div
          className="flex items-center gap-4 rounded-2xl p-4"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold"
            style={{ background: "rgba(232,168,56,0.15)", color: "#e8a838", fontFamily: "var(--font-display)" }}
          >
            {post.profiles?.username?.[0]?.toUpperCase() ?? "?"}
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: "#f5f0e8" }}>
              {post.profiles?.username ?? "Unknown"}
            </p>
            {post.published_at && (
              <p className="text-xs" style={{ color: "#9a948a" }}>
                {new Date(post.published_at).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <div
        className="animate-fade-slide-up delay-200"
        style={{ color: "#c8c0b0" }}
      >
        <MarkdownRenderer content={post.content} />
      </div>

      {/* Divider */}
      <div
        className="my-12 flex items-center gap-3"
      >
        <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
        <svg width="8" height="8" viewBox="0 0 8 8" fill="#e8a838">
          <circle cx="4" cy="4" r="4" />
        </svg>
        <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
      </div>

      {/* Comments */}
      <div className="animate-fade-slide-up delay-300">
        <CommentSection postId={post.id} />
      </div>
    </article>
  );
}
