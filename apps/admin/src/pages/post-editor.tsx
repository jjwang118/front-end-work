import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";
import { supabase } from "@/lib/supabase";
import { createPost, updatePost } from "@repo/database";
import { Button, Input } from "@repo/ui";

export default function PostEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      async function loadPost() {
        const { data } = await (supabase as any).from("posts").select("*").eq("id", Number(id)).single();
        if (data) {
          setTitle(data.title);
          setSlug(data.slug);
          setContent(data.content);
          setExcerpt(data.excerpt ?? "");
          setStatus(data.status as "draft" | "published");
        }
      }
      loadPost();
    }
  }, [id]);

  async function handleSave() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (id) {
      await updatePost(supabase, Number(id), {
        title, slug, content, excerpt, status,
        published_at: status === "published" ? new Date().toISOString() : null,
      });
    } else {
      await createPost(supabase, {
        title, slug, content, excerpt, status,
        author_id: user.id,
        cover_image: null,
        category_id: null,
        published_at: status === "published" ? new Date().toISOString() : null,
      });
    }
    setLoading(false);
    navigate("/posts");
  }

  function generateSlug(title: string) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{id ? "Edit Post" : "New Post"}</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => { setStatus("draft"); handleSave(); }} disabled={loading}>
            Save Draft
          </Button>
          <Button onClick={() => { setStatus("published"); handleSave(); }} disabled={loading}>
            Publish
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <Input placeholder="Post title" value={title} onChange={(e) => { setTitle(e.target.value); if (!id) setSlug(generateSlug(e.target.value)); }} />
        <Input placeholder="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
        <Input placeholder="Excerpt (optional)" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
        <div data-color-mode="light">
          <MDEditor value={content} onChange={(val) => setContent(val ?? "")} height={500} />
        </div>
      </div>
    </div>
  );
}
