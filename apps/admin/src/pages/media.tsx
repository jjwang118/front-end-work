import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { uploadImage, deleteImage, listImages } from "@repo/database";
import { Button, Card, Input } from "@repo/ui";

export default function MediaPage() {
  const [images, setImages] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadImages();
  }, []);

  async function loadImages() {
    const { data } = await listImages(supabase);
    if (data) setImages(data);
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const path = `${Date.now()}-${file.name}`;
    await uploadImage(supabase, path, file);
    await loadImages();
    setUploading(false);
  }

  async function handleDelete(name: string) {
    await deleteImage(supabase, name);
    setImages((prev) => prev.filter((img) => img.name !== name));
  }

  function getPublicUrl(name: string) {
    return supabase.storage.from("post-images").getPublicUrl(name).data.publicUrl;
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Media Library</h1>
        <div>
          <Input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {images.map((img) => (
          <Card key={img.name} className="overflow-hidden">
            <img src={getPublicUrl(img.name)} alt={img.name} className="aspect-video w-full object-cover" />
            <div className="flex items-center justify-between p-2">
              <p className="truncate text-xs text-muted-foreground">{img.name}</p>
              <Button variant="ghost" size="sm" onClick={() => handleDelete(img.name)}>
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
