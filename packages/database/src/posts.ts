import type { SupabaseClient } from "./client";
import type { Post } from "./types";

export async function getPosts(
  client: SupabaseClient,
  options?: { status?: string; categoryId?: number; limit?: number; offset?: number }
) {
  let query = client
    .from("posts")
    .select("*, categories(name, slug), profiles(username, avatar_url)")
    .order("published_at", { ascending: false });

  if (options?.status) {
    query = query.eq("status", options.status);
  }
  if (options?.categoryId) {
    query = query.eq("category_id", options.categoryId);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }
  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit ?? 10) - 1);
  }

  return query;
}

export async function getPostBySlug(client: SupabaseClient, slug: string) {
  return client
    .from("posts")
    .select("*, categories(name, slug), profiles(username, avatar_url)")
    .eq("slug", slug)
    .single();
}

export async function createPost(client: SupabaseClient, post: Omit<Post, "id" | "created_at" | "updated_at">) {
  return client.from("posts").insert(post as any).select().single();
}

export async function updatePost(client: SupabaseClient, id: number, updates: Partial<Post>) {
  return (client.from("posts") as any).update({ ...updates, updated_at: new Date().toISOString() }).eq("id", id).select().single();
}

export async function deletePost(client: SupabaseClient, id: number) {
  return client.from("posts").delete().eq("id", id);
}
