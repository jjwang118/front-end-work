import type { SupabaseClient } from "./client";

const BUCKET = "post-images";

export async function uploadImage(client: SupabaseClient, path: string, file: File) {
  const { data, error } = await client.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;
  const { data: urlData } = client.storage.from(BUCKET).getPublicUrl(data.path);
  return urlData.publicUrl;
}

export async function deleteImage(client: SupabaseClient, path: string): Promise<any> {
  return client.storage.from(BUCKET).remove([path]);
}

export async function listImages(client: SupabaseClient, folder?: string): Promise<any> {
  return client.storage.from(BUCKET).list(folder ?? "", {
    limit: 100,
    sortBy: { column: "created_at", order: "desc" },
  });
}
