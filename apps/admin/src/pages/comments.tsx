import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { deleteComment } from "@repo/database";
import {
  Button,
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@repo/ui";

export default function CommentsPage() {
  const [comments, setComments] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("comments")
        .select("*, profiles(username), posts(title)")
        .order("created_at", { ascending: false });
      if (data) setComments(data);
    }
    load();
  }, []);

  async function handleDelete(id: number) {
    await deleteComment(supabase, id);
    setComments((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Comments</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Author</TableHead>
            <TableHead>Post</TableHead>
            <TableHead>Content</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="w-[80px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {comments.map((comment) => (
            <TableRow key={comment.id}>
              <TableCell>{comment.profiles?.username ?? "Unknown"}</TableCell>
              <TableCell>{comment.posts?.title ?? "\u2014"}</TableCell>
              <TableCell className="max-w-xs truncate">{comment.content}</TableCell>
              <TableCell>{new Date(comment.created_at).toLocaleDateString()}</TableCell>
              <TableCell>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(comment.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
