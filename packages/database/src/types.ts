export type UserRole = "admin" | "reader";
export type PostStatus = "draft" | "published";

export interface Profile {
  id: string;
  username: string;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  created_at: string;
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  cover_image: string | null;
  category_id: number | null;
  author_id: string;
  status: PostStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: number;
  name: string;
}

export interface PostTag {
  post_id: number;
  tag_id: number;
}

export interface Comment {
  id: number;
  post_id: number;
  author_id: string;
  content: string;
  parent_id: number | null;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Omit<Profile, "created_at">; Update: Partial<Profile> };
      categories: { Row: Category; Insert: Omit<Category, "id" | "created_at">; Update: Partial<Category> };
      posts: { Row: Post; Insert: Omit<Post, "id" | "created_at" | "updated_at">; Update: Partial<Post> };
      tags: { Row: Tag; Insert: Omit<Tag, "id">; Update: Partial<Tag> };
      post_tags: { Row: PostTag; Insert: PostTag; Update: Partial<PostTag> };
      comments: { Row: Comment; Insert: Omit<Comment, "id" | "created_at">; Update: Partial<Comment> };
    };
  };
}
