import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "@repo/ui";

export default function DashboardPage() {
  const [stats, setStats] = useState({ posts: 0, published: 0, comments: 0 });

  useEffect(() => {
    async function loadStats() {
      const [postsRes, publishedRes, commentsRes] = await Promise.all([
        supabase.from("posts").select("id", { count: "exact", head: true }),
        supabase.from("posts").select("id", { count: "exact", head: true }).eq("status", "published"),
        supabase.from("comments").select("id", { count: "exact", head: true }),
      ]);
      setStats({
        posts: postsRes.count ?? 0,
        published: publishedRes.count ?? 0,
        comments: commentsRes.count ?? 0,
      });
    }
    loadStats();
  }, []);

  const cards = [
    { title: "Total Posts", value: stats.posts },
    { title: "Published", value: stats.published },
    { title: "Comments", value: stats.comments },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
