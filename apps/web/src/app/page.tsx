import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getPosts } from "@repo/database";
import { PostCard } from "@/components/post-card";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = await createServerSupabaseClient();
  const { data: posts } = await getPosts(supabase as any, { status: "published", limit: 12 });

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Latest Posts</h1>
      {posts && posts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post: any) => (
            <PostCard
              key={post.id}
              title={post.title}
              slug={post.slug}
              excerpt={post.excerpt}
              coverImage={post.cover_image}
              categoryName={post.categories?.name ?? null}
              authorName={post.profiles?.username ?? "Unknown"}
              publishedAt={post.published_at}
            />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No posts yet.</p>
      )}
    </div>
  );
}
