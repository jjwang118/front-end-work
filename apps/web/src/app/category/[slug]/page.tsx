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
    <div>
      <h1 className="mb-8 text-3xl font-bold">Category: {(category as any).name}</h1>
      {posts && posts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post: any) => (
            <PostCard
              key={post.id}
              title={post.title}
              slug={post.slug}
              excerpt={post.excerpt}
              coverImage={post.cover_image}
              categoryName={null}
              authorName={post.profiles?.username ?? "Unknown"}
              publishedAt={post.published_at}
            />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No posts in this category.</p>
      )}
    </div>
  );
}
