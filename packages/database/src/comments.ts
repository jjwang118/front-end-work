import type { SupabaseClient } from "./client";

export async function getCommentsByPostId(client: SupabaseClient, postId: number) {
  return client
    .from("comments")
    .select("*, profiles(username, avatar_url)")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });
}

export async function createComment(
  client: SupabaseClient,
  comment: { post_id: number; author_id: string; content: string; parent_id?: number | null }
) {
  return client.from("comments").insert(comment as any).select("*, profiles(username, avatar_url)").single();
}

export async function deleteComment(client: SupabaseClient, id: number) {
  return client.from("comments").delete().eq("id", id);
}
