import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getPostBySlug } from "@repo/database";
import { MarkdownRenderer, Badge, Avatar, AvatarFallback } from "@repo/ui";
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
    <article className="mx-auto max-w-3xl">
      {post.cover_image && (
        <img src={post.cover_image} alt={post.title} className="mb-8 w-full rounded-lg object-cover" />
      )}
      <header className="mb-8">
        {post.categories?.name && (
          <Badge variant="secondary" className="mb-2">{post.categories.name}</Badge>
        )}
        <h1 className="text-4xl font-bold">{post.title}</h1>
        <div className="mt-4 flex items-center gap-3">
          <Avatar>
            <AvatarFallback>{post.profiles?.username?.[0]?.toUpperCase() ?? "?"}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{post.profiles?.username ?? "Unknown"}</p>
            {post.published_at && (
              <p className="text-xs text-muted-foreground">{new Date(post.published_at).toLocaleDateString()}</p>
            )}
          </div>
        </div>
      </header>

      <MarkdownRenderer content={post.content} />

      <CommentSection postId={post.id} />
    </article>
  );
}
