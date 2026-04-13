import type { SupabaseClient } from "./client";

export async function getCategories(client: SupabaseClient) {
  return client.from("categories").select("*").order("name");
}

export async function getCategoryBySlug(client: SupabaseClient, slug: string) {
  return client.from("categories").select("*").eq("slug", slug).single();
}

export async function createCategory(client: SupabaseClient, name: string, slug: string) {
  return client.from("categories").insert({ name, slug } as any).select().single();
}

export async function deleteCategory(client: SupabaseClient, id: number) {
  return client.from("categories").delete().eq("id", id);
}
