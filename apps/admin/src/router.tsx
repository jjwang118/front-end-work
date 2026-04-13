import { createBrowserRouter } from "react-router-dom";
import { AuthGuard } from "@/components/auth-guard";
import { AdminLayout } from "@/components/admin-layout";

import LoginPage from "@/pages/login";
import DashboardPage from "@/pages/dashboard";
import PostsPage from "@/pages/posts";
import PostEditorPage from "@/pages/post-editor";
import CommentsPage from "@/pages/comments";
import MediaPage from "@/pages/media";

export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  {
    element: (
      <AuthGuard>
        <AdminLayout />
      </AuthGuard>
    ),
    children: [
      { path: "/dashboard", element: <DashboardPage /> },
      { path: "/posts", element: <PostsPage /> },
      { path: "/posts/new", element: <PostEditorPage /> },
      { path: "/posts/:id/edit", element: <PostEditorPage /> },
      { path: "/comments", element: <CommentsPage /> },
      { path: "/media", element: <MediaPage /> },
      { path: "/", element: <DashboardPage /> },
    ],
  },
]);
