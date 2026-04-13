"use client";

import { useState, useEffect } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { getCommentsByPostId, createComment } from "@repo/database";
import { Button, Input, Avatar, AvatarFallback } from "@repo/ui";

interface CommentSectionProps {
  postId: number;
}

export function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createBrowserSupabaseClient();

  useEffect(() => {
    async function load() {
      const { data } = await getCommentsByPostId(supabase as any, postId);
      if (data) setComments(data);

      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }
    load();
  }, [postId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setLoading(true);
    const { data } = await createComment(supabase as any, {
      post_id: postId,
      author_id: user.id,
      content: newComment.trim(),
    });
    if (data) {
      setComments((prev) => [...prev, data]);
      setNewComment("");
    }
    setLoading(false);
  }

  return (
    <section className="mt-12">
      <h2 className="mb-6 text-2xl font-bold">Comments ({comments.length})</h2>

      <div className="space-y-4">
        {comments.map((comment: any) => (
          <div key={comment.id} className="flex gap-3 rounded-lg border p-4">
            <Avatar>
              <AvatarFallback>{comment.profiles?.username?.[0]?.toUpperCase() ?? "?"}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{comment.profiles?.username ?? "Anonymous"}</p>
              <p className="text-sm text-muted-foreground">{new Date(comment.created_at).toLocaleString()}</p>
              <p className="mt-1">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>

      {user ? (
        <form onSubmit={handleSubmit} className="mt-6 flex gap-2">
          <Input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1"
          />
          <Button type="submit" disabled={loading || !newComment.trim()}>
            {loading ? "Posting..." : "Post"}
          </Button>
        </form>
      ) : (
        <p className="mt-6 text-sm text-muted-foreground">
          <a href="/auth/login" className="underline">Log in</a> to leave a comment.
        </p>
      )}
    </section>
  );
}
