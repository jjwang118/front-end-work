import type { SupabaseClient } from "./client";
import type { Profile } from "./types";

export async function getProfile(client: SupabaseClient, userId: string) {
  return client.from("profiles").select("*").eq("id", userId).single();
}

export async function updateProfile(client: SupabaseClient, userId: string, updates: Partial<Profile>) {
  return (client.from("profiles") as any).update(updates).eq("id", userId).select().single();
}

export async function isAdmin(client: SupabaseClient, userId: string): Promise<boolean> {
  const { data } = await client.from("profiles").select("role").eq("id", userId).single();
  return (data as any)?.role === "admin";
}
