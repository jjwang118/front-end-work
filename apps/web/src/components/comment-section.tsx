"use client";

import { useState, useEffect } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { getCommentsByPostId, createComment } from "@repo/database";

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
    <section>
      <div className="mb-6 flex items-center gap-3">
        <div
          className="h-1 w-6 rounded-full"
          style={{ background: "#e8a838" }}
        />
        <h2
          className="text-2xl font-bold"
          style={{ fontFamily: "var(--font-display)", color: "#f5f0e8" }}
        >
          Discussion ({comments.length})
        </h2>
      </div>

      {/* Comments list */}
      <div className="space-y-4">
        {comments.map((comment: any) => (
          <div
            key={comment.id}
            className="rounded-xl p-4"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div className="flex gap-3">
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                style={{
                  background: "rgba(232,168,56,0.1)",
                  color: "#e8a838",
                  fontFamily: "var(--font-display)",
                }}
              >
                {comment.profiles?.username?.[0]?.toUpperCase() ?? "?"}
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-sm font-medium" style={{ color: "#f5f0e8" }}>
                    {comment.profiles?.username ?? "Anonymous"}
                  </span>
                  <span className="text-xs" style={{ color: "#9a948a" }}>
                    {new Date(comment.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "#c8c0b0" }}>
                  {comment.content}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Comment input */}
      {user ? (
        <form onSubmit={handleSubmit} className="mt-6">
          <div
            className="rounded-xl p-1"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts..."
              rows={3}
              className="w-full resize-none rounded-lg bg-transparent px-4 py-3 text-sm focus:outline-none"
              style={{ color: "#f5f0e8" }}
            />
            <div className="flex items-center justify-between px-3 pb-3">
              <span className="text-xs" style={{ color: "#9a948a" }}>
                Posting as {(user as any)?.user_metadata?.username || user.email?.split("@")[0]}
              </span>
              <button
                type="submit"
                disabled={loading || !newComment.trim()}
                className="rounded-lg px-4 py-1.5 text-sm font-medium transition-all focus:outline-none disabled:opacity-40"
                style={{
                  background: newComment.trim() ? "#e8a838" : "rgba(255,255,255,0.06)",
                  color: newComment.trim() ? "#0d0d0f" : "#9a948a",
                }}
              >
                {loading ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div
          className="mt-6 flex items-center justify-between rounded-xl p-4"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <span className="text-sm" style={{ color: "#9a948a" }}>
            Join the conversation
          </span>
          <a
            href="/auth/login"
            className="rounded-lg px-4 py-1.5 text-sm font-medium transition-colors"
            style={{ background: "#e8a838", color: "#0d0d0f" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f0c060")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#e8a838")}
          >
            Sign In
          </a>
        </div>
      )}
    </section>
  );
}
