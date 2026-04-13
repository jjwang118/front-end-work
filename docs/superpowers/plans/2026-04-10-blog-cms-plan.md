# Blog/CMS Full-Stack Monorepo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a full-stack personal blog/CMS with monorepo architecture demonstrating pnpm + Turborepo + Next.js + Vite + Supabase + shadcn/ui + Tailwind, deployed via GitHub Actions CI/CD to Vercel.

**Architecture:** Monorepo with 2 apps (Next.js blog frontend, Vite admin dashboard) and 3 shared packages (ui, database, config). Supabase provides auth, database, and storage. GitHub Actions handles CI/CD with Vercel deployment.

**Tech Stack:** pnpm 10, Turborepo, Next.js 15 (App Router), Vite 6, React 19, Supabase, shadcn/ui, Tailwind CSS 4, TypeScript 5, React Router v6

---

## Task 1: Monorepo Root Scaffolding

**Files:**
- Create: `package.json`
- Create: `pnpm-workspace.yaml`
- Create: `turbo.json`
- Create: `.gitignore`
- Create: `.npmrc`
- Create: `.env.example`

- [ ] **Step 1: Create root package.json**

```json
{
  "name": "blog-cms-monorepo",
  "private": true,
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "lint": "turbo lint",
    "typecheck": "turbo typecheck",
    "clean": "turbo clean"
  },
  "devDependencies": {
    "turbo": "^2"
  },
  "packageManager": "pnpm@10.8.0"
}
```

- [ ] **Step 2: Create pnpm-workspace.yaml**

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

- [ ] **Step 3: Create turbo.json**

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "typecheck": {
      "dependsOn": ["^build"]
    },
    "clean": {
      "cache": false
    }
  }
}
```

- [ ] **Step 4: Create .gitignore**

```
node_modules/
dist/
.next/
.turbo/
.env
.env.local
.env.*.local
*.tsbuildinfo
```

- [ ] **Step 5: Create .npmrc**

```
auto-install-peers=true
```

- [ ] **Step 6: Create .env.example**

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

- [ ] **Step 7: Install turbo and verify**

Run: `pnpm install`
Expected: `node_modules/` created, `pnpm-lock.yaml` generated.

Run: `pnpm turbo --version`
Expected: turbo version printed (2.x).

- [ ] **Step 8: Commit**

```bash
git add package.json pnpm-workspace.yaml turbo.json .gitignore .npmrc .env.example pnpm-lock.yaml
git commit -m "chore: scaffold monorepo root with pnpm + turborepo"
```

---

## Task 2: @repo/config — Shared Configuration Package

**Files:**
- Create: `packages/config/package.json`
- Create: `packages/config/tsconfig/base.json`
- Create: `packages/config/tsconfig/nextjs.json`
- Create: `packages/config/tsconfig/vite.json`
- Create: `packages/config/eslint/base.js`

- [ ] **Step 1: Create packages/config/package.json**

```json
{
  "name": "@repo/config",
  "version": "0.0.0",
  "private": true,
  "exports": {
    "./tsconfig/*": "./tsconfig/*.json",
    "./eslint/*": "./eslint/*.js"
  }
}
```

- [ ] **Step 2: Create packages/config/tsconfig/base.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "jsx": "react-jsx",
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "exclude": ["node_modules", "dist"]
}
```

- [ ] **Step 3: Create packages/config/tsconfig/nextjs.json**

```json
{
  "extends": "./base.json",
  "compilerOptions": {
    "plugins": [{ "name": "next" }],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowJs": true,
    "noEmit": true
  }
}
```

- [ ] **Step 4: Create packages/config/tsconfig/vite.json**

```json
{
  "extends": "./base.json",
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "bundler",
    "noEmit": true
  }
}
```

- [ ] **Step 5: Create packages/config/eslint/base.js**

```js
import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
  {
    ignores: ["node_modules/", "dist/", ".next/", ".turbo/"],
  },
];
```

- [ ] **Step 6: Commit**

```bash
git add packages/config/
git commit -m "chore: add @repo/config with shared TS and ESLint configs"
```

---

## Task 3: @repo/database — Supabase Data Layer Package

**Files:**
- Create: `packages/database/package.json`
- Create: `packages/database/tsconfig.json`
- Create: `packages/database/src/index.ts`
- Create: `packages/database/src/client.ts`
- Create: `packages/database/src/types.ts`
- Create: `packages/database/src/posts.ts`
- Create: `packages/database/src/comments.ts`
- Create: `packages/database/src/auth.ts`
- Create: `packages/database/src/storage.ts`
- Create: `packages/database/src/categories.ts`

- [ ] **Step 1: Create packages/database/package.json**

```json
{
  "name": "@repo/database",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "exports": {
    ".": "./src/index.ts",
    "./client": "./src/client.ts",
    "./types": "./src/types.ts"
  },
  "scripts": {
    "typecheck": "tsc --noEmit",
    "generate-types": "supabase gen types typescript --project-id $SUPABASE_PROJECT_ID > src/types.ts"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2"
  },
  "devDependencies": {
    "typescript": "^5",
    "supabase": "^2"
  }
}
```

- [ ] **Step 2: Create packages/database/tsconfig.json**

```json
{
  "extends": "@repo/config/tsconfig/base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"]
}
```

- [ ] **Step 3: Create packages/database/src/types.ts**

This is the manual type definition. In production, use `supabase gen types` to auto-generate.

```ts
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
```

- [ ] **Step 4: Create packages/database/src/client.ts**

```ts
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

export function createSupabaseClient(supabaseUrl: string, supabaseKey: string) {
  return createClient<Database>(supabaseUrl, supabaseKey);
}

export type SupabaseClient = ReturnType<typeof createSupabaseClient>;
```

- [ ] **Step 5: Create packages/database/src/posts.ts**

```ts
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
  return client.from("posts").insert(post).select().single();
}

export async function updatePost(client: SupabaseClient, id: number, updates: Partial<Post>) {
  return client.from("posts").update({ ...updates, updated_at: new Date().toISOString() }).eq("id", id).select().single();
}

export async function deletePost(client: SupabaseClient, id: number) {
  return client.from("posts").delete().eq("id", id);
}
```

- [ ] **Step 6: Create packages/database/src/categories.ts**

```ts
import type { SupabaseClient } from "./client";

export async function getCategories(client: SupabaseClient) {
  return client.from("categories").select("*").order("name");
}

export async function getCategoryBySlug(client: SupabaseClient, slug: string) {
  return client.from("categories").select("*").eq("slug", slug).single();
}

export async function createCategory(client: SupabaseClient, name: string, slug: string) {
  return client.from("categories").insert({ name, slug }).select().single();
}

export async function deleteCategory(client: SupabaseClient, id: number) {
  return client.from("categories").delete().eq("id", id);
}
```

- [ ] **Step 7: Create packages/database/src/comments.ts**

```ts
import type { SupabaseClient } from "./client";

export async function getCommentsByPostId(client: SupabaseClient, postId: number) {
  return client
    .from("comments")
    .select("*, profiles(username, avatar_url)")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });
}

export async function createComment(
  client: SupabaseClient,
  comment: { post_id: number; author_id: string; content: string; parent_id?: number | null }
) {
  return client.from("comments").insert(comment).select("*, profiles(username, avatar_url)").single();
}

export async function deleteComment(client: SupabaseClient, id: number) {
  return client.from("comments").delete().eq("id", id);
}
```

- [ ] **Step 8: Create packages/database/src/auth.ts**

```ts
import type { SupabaseClient } from "./client";
import type { Profile } from "./types";

export async function getProfile(client: SupabaseClient, userId: string) {
  return client.from("profiles").select("*").eq("id", userId).single();
}

export async function updateProfile(client: SupabaseClient, userId: string, updates: Partial<Profile>) {
  return client.from("profiles").update(updates).eq("id", userId).select().single();
}

export async function isAdmin(client: SupabaseClient, userId: string): Promise<boolean> {
  const { data } = await client.from("profiles").select("role").eq("id", userId).single();
  return data?.role === "admin";
}
```

- [ ] **Step 9: Create packages/database/src/storage.ts**

```ts
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

export async function deleteImage(client: SupabaseClient, path: string) {
  return client.storage.from(BUCKET).remove([path]);
}

export async function listImages(client: SupabaseClient, folder?: string) {
  return client.storage.from(BUCKET).list(folder ?? "", {
    limit: 100,
    sortBy: { column: "created_at", order: "desc" },
  });
}
```

- [ ] **Step 10: Create packages/database/src/index.ts**

```ts
export { createSupabaseClient, type SupabaseClient } from "./client";
export type * from "./types";
export * from "./posts";
export * from "./categories";
export * from "./comments";
export * from "./auth";
export * from "./storage";
```

- [ ] **Step 11: Install dependencies and typecheck**

Run: `pnpm install`
Run: `pnpm --filter @repo/database typecheck`
Expected: No type errors.

- [ ] **Step 12: Commit**

```bash
git add packages/database/
git commit -m "feat: add @repo/database package with Supabase data layer"
```

---

## Task 4: @repo/ui — Shared UI Component Library

**Files:**
- Create: `packages/ui/package.json`
- Create: `packages/ui/tsconfig.json`
- Create: `packages/ui/src/index.ts`
- Create: `packages/ui/src/lib/utils.ts`
- Create: `packages/ui/src/components/button.tsx`
- Create: `packages/ui/src/components/input.tsx`
- Create: `packages/ui/src/components/card.tsx`
- Create: `packages/ui/src/components/badge.tsx`
- Create: `packages/ui/src/components/avatar.tsx`
- Create: `packages/ui/src/components/dialog.tsx`
- Create: `packages/ui/src/components/table.tsx`
- Create: `packages/ui/src/components/dropdown-menu.tsx`
- Create: `packages/ui/src/components/pagination.tsx`
- Create: `packages/ui/src/components/markdown-renderer.tsx`
- Create: `packages/ui/src/globals.css`
- Create: `packages/ui/tailwind.config.ts`
- Create: `packages/ui/postcss.config.mjs`

- [ ] **Step 1: Create packages/ui/package.json**

```json
{
  "name": "@repo/ui",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "exports": {
    ".": "./src/index.ts",
    "./globals.css": "./src/globals.css",
    "./tailwind.config": "./tailwind.config.ts",
    "./postcss.config": "./postcss.config.mjs",
    "./lib/utils": "./src/lib/utils.ts"
  },
  "scripts": {
    "typecheck": "tsc --noEmit",
    "lint": "eslint ."
  },
  "dependencies": {
    "class-variance-authority": "^0.7",
    "clsx": "^2",
    "tailwind-merge": "^3",
    "lucide-react": "^0.400",
    "react-markdown": "^9",
    "rehype-highlight": "^7",
    "remark-gfm": "^4",
    "@radix-ui/react-dialog": "^1",
    "@radix-ui/react-dropdown-menu": "^2",
    "@radix-ui/react-avatar": "^1",
    "@radix-ui/react-slot": "^1"
  },
  "devDependencies": {
    "react": "^19",
    "react-dom": "^19",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "typescript": "^5",
    "tailwindcss": "^4",
    "@tailwindcss/postcss": "^4",
    "postcss": "^8"
  },
  "peerDependencies": {
    "react": "^19",
    "react-dom": "^19"
  }
}
```

- [ ] **Step 2: Create packages/ui/tsconfig.json**

```json
{
  "extends": "@repo/config/tsconfig/base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"]
}
```

- [ ] **Step 3: Create packages/ui/tailwind.config.ts**

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};
export default config;
```

- [ ] **Step 4: Create packages/ui/postcss.config.mjs**

```js
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

- [ ] **Step 5: Create packages/ui/src/globals.css**

```css
@import "tailwindcss";

@theme {
  --color-border: hsl(214.3 31.8% 91.4%);
  --color-input: hsl(214.3 31.8% 91.4%);
  --color-ring: hsl(222.2 84% 4.9%);
  --color-background: hsl(0 0% 100%);
  --color-foreground: hsl(222.2 84% 4.9%);
  --color-primary: hsl(222.2 47.4% 11.2%);
  --color-primary-foreground: hsl(210 40% 98%);
  --color-secondary: hsl(210 40% 96.1%);
  --color-secondary-foreground: hsl(222.2 47.4% 11.2%);
  --color-destructive: hsl(0 84.2% 60.2%);
  --color-destructive-foreground: hsl(210 40% 98%);
  --color-muted: hsl(210 40% 96.1%);
  --color-muted-foreground: hsl(215.4 16.3% 46.9%);
  --color-accent: hsl(210 40% 96.1%);
  --color-accent-foreground: hsl(222.2 47.4% 11.2%);
  --color-card: hsl(0 0% 100%);
  --color-card-foreground: hsl(222.2 84% 4.9%);
  --radius: 0.5rem;
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

- [ ] **Step 6: Create packages/ui/src/lib/utils.ts**

```ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 7: Create shadcn component — Button**

Create `packages/ui/src/components/button.tsx`:

```tsx
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
```

- [ ] **Step 8: Create shadcn component — Input**

Create `packages/ui/src/components/input.tsx`:

```tsx
import * as React from "react";
import { cn } from "../lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
```

- [ ] **Step 9: Create shadcn component — Card**

Create `packages/ui/src/components/card.tsx`:

```tsx
import * as React from "react";
import { cn } from "../lib/utils";

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)} {...props} />
  )
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  )
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
  )
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  )
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  )
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
```

- [ ] **Step 10: Create shadcn component — Badge**

Create `packages/ui/src/components/badge.tsx`:

```tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
```

- [ ] **Step 11: Create shadcn component — Avatar**

Create `packages/ui/src/components/avatar.tsx`:

```tsx
"use client";
import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "../lib/utils";

const Avatar = React.forwardRef<
  React.ComponentRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)}
    {...props}
  />
));
Avatar.displayName = "Avatar";

const AvatarImage = React.forwardRef<
  React.ComponentRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image ref={ref} className={cn("aspect-square h-full w-full", className)} {...props} />
));
AvatarImage.displayName = "AvatarImage";

const AvatarFallback = React.forwardRef<
  React.ComponentRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn("flex h-full w-full items-center justify-center rounded-full bg-muted", className)}
    {...props}
  />
));
AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback };
```

- [ ] **Step 12: Create shadcn component — Dialog**

Create `packages/ui/src/components/dialog.tsx`:

```tsx
"use client";
import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "../lib/utils";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = "DialogOverlay";

const DialogContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = "DialogContent";

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
);

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
);

const DialogTitle = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title ref={ref} className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />
));
DialogTitle.displayName = "DialogTitle";

const DialogDescription = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
));
DialogDescription.displayName = "DialogDescription";

export {
  Dialog, DialogPortal, DialogOverlay, DialogClose, DialogTrigger, DialogContent,
  DialogHeader, DialogFooter, DialogTitle, DialogDescription,
};
```

- [ ] **Step 13: Create shadcn component — Table**

Create `packages/ui/src/components/table.tsx`:

```tsx
import * as React from "react";
import { cn } from "../lib/utils";

const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div className="relative w-full overflow-auto">
      <table ref={ref} className={cn("w-full caption-bottom text-sm", className)} {...props} />
    </div>
  )
);
Table.displayName = "Table";

const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
);
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} />
);
TableBody.displayName = "TableBody";

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr ref={ref} className={cn("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted", className)} {...props} />
  )
);
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <th ref={ref} className={cn("h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0", className)} {...props} />
  )
);
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td ref={ref} className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)} {...props} />
  )
);
TableCell.displayName = "TableCell";

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };
```

- [ ] **Step 14: Create Pagination component**

Create `packages/ui/src/components/pagination.tsx`:

```tsx
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "./button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({ currentPage, totalPages, onPageChange, className }: PaginationProps) {
  return (
    <nav className={cn("flex items-center justify-center space-x-2", className)}>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Button
          key={page}
          variant={page === currentPage ? "default" : "outline"}
          size="icon"
          onClick={() => onPageChange(page)}
        >
          {page}
        </Button>
      ))}
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
}
```

- [ ] **Step 15: Create MarkdownRenderer component**

Create `packages/ui/src/components/markdown-renderer.tsx`:

```tsx
"use client";
import * as React from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { cn } from "../lib/utils";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div className={cn("prose prose-neutral max-w-none dark:prose-invert", className)}>
      <ReactMarkdown rehypePlugins={[rehypeHighlight]} remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
```

- [ ] **Step 16: Create packages/ui/src/index.ts**

```ts
export { Button, buttonVariants, type ButtonProps } from "./components/button";
export { Input } from "./components/input";
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "./components/card";
export { Badge, badgeVariants, type BadgeProps } from "./components/badge";
export { Avatar, AvatarImage, AvatarFallback } from "./components/avatar";
export {
  Dialog, DialogPortal, DialogOverlay, DialogClose, DialogTrigger, DialogContent,
  DialogHeader, DialogFooter, DialogTitle, DialogDescription,
} from "./components/dialog";
export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "./components/table";
export { Pagination } from "./components/pagination";
export { MarkdownRenderer } from "./components/markdown-renderer";
export { cn } from "./lib/utils";
```

- [ ] **Step 17: Install dependencies and typecheck**

Run: `pnpm install`
Run: `pnpm --filter @repo/ui typecheck`
Expected: No type errors.

- [ ] **Step 18: Commit**

```bash
git add packages/ui/
git commit -m "feat: add @repo/ui with shadcn components and markdown renderer"
```

---

## Task 5: apps/web — Next.js Blog Frontend Scaffolding

**Files:**
- Create: `apps/web/package.json`
- Create: `apps/web/tsconfig.json`
- Create: `apps/web/next.config.ts`
- Create: `apps/web/postcss.config.mjs`
- Create: `apps/web/eslint.config.js`
- Create: `apps/web/src/app/layout.tsx`
- Create: `apps/web/src/app/globals.css`
- Create: `apps/web/src/lib/supabase/server.ts`
- Create: `apps/web/src/lib/supabase/client.ts`

- [ ] **Step 1: Create apps/web/package.json**

```json
{
  "name": "@repo/web",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack --port 3000",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "next": "^15",
    "react": "^19",
    "react-dom": "^19",
    "@supabase/ssr": "^0.5",
    "@repo/ui": "workspace:*",
    "@repo/database": "workspace:*"
  },
  "devDependencies": {
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "typescript": "^5",
    "tailwindcss": "^4",
    "@tailwindcss/postcss": "^4",
    "postcss": "^8",
    "@eslint/js": "^9",
    "typescript-eslint": "^8",
    "eslint": "^9",
    "@repo/config": "workspace:*"
  }
}
```

- [ ] **Step 2: Create apps/web/tsconfig.json**

```json
{
  "extends": "@repo/config/tsconfig/nextjs.json",
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "src", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: Create apps/web/next.config.ts**

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@repo/ui", "@repo/database"],
};

export default nextConfig;
```

- [ ] **Step 4: Create apps/web/postcss.config.mjs**

```js
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

- [ ] **Step 5: Create apps/web/eslint.config.js**

```js
import baseConfig from "@repo/config/eslint/base.js";

export default [
  ...baseConfig,
  {
    ignores: [".next/"],
  },
];
```

- [ ] **Step 6: Create apps/web/src/app/globals.css**

```css
@import "tailwindcss";
@import "@repo/ui/globals.css";

@config "../../node_modules/@repo/ui/tailwind.config.ts";
```

Note: The exact import path for tailwind config may need adjustment based on how pnpm resolves workspace packages. Alternatively, use `@source` directive for Tailwind v4. Adjust during implementation if needed.

- [ ] **Step 7: Create apps/web/src/lib/supabase/server.ts**

```ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component — can't set cookies, but that's OK
          }
        },
      },
    }
  );
}
```

- [ ] **Step 8: Create apps/web/src/lib/supabase/client.ts**

```ts
"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@repo/database/types";

export function createBrowserSupabaseClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

- [ ] **Step 9: Create apps/web/src/app/layout.tsx**

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My Blog",
  description: "A personal blog built with Next.js and Supabase",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="border-b">
          <nav className="container mx-auto flex h-16 items-center justify-between px-4">
            <a href="/" className="text-xl font-bold">My Blog</a>
            <div className="flex items-center gap-4">
              <a href="/auth/login" className="text-sm text-muted-foreground hover:text-foreground">
                Login
              </a>
            </div>
          </nav>
        </header>
        <main className="container mx-auto px-4 py-8">{children}</main>
        <footer className="border-t py-6 text-center text-sm text-muted-foreground">
          Built with Next.js + Supabase
        </footer>
      </body>
    </html>
  );
}
```

- [ ] **Step 10: Install dependencies and verify dev server**

Run: `pnpm install`
Run: `pnpm --filter @repo/web dev`
Expected: Next.js dev server starts on http://localhost:3000 and renders the layout.

- [ ] **Step 11: Commit**

```bash
git add apps/web/
git commit -m "feat: scaffold Next.js blog frontend with Supabase SSR setup"
```

---

## Task 6: apps/web — Blog Pages (Home, Post Detail, Category)

**Files:**
- Create: `apps/web/src/app/page.tsx`
- Create: `apps/web/src/app/[slug]/page.tsx`
- Create: `apps/web/src/app/category/[slug]/page.tsx`
- Create: `apps/web/src/components/post-card.tsx`
- Create: `apps/web/src/components/comment-section.tsx`

- [ ] **Step 1: Create PostCard component**

Create `apps/web/src/components/post-card.tsx`:

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Badge } from "@repo/ui";

interface PostCardProps {
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  categoryName: string | null;
  authorName: string;
  publishedAt: string | null;
}

export function PostCard({ title, slug, excerpt, coverImage, categoryName, authorName, publishedAt }: PostCardProps) {
  return (
    <a href={`/${slug}`}>
      <Card className="h-full transition-shadow hover:shadow-md">
        {coverImage && (
          <div className="aspect-video overflow-hidden rounded-t-lg">
            <img src={coverImage} alt={title} className="h-full w-full object-cover" />
          </div>
        )}
        <CardHeader>
          {categoryName && <Badge variant="secondary" className="w-fit">{categoryName}</Badge>}
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription>{excerpt}</CardDescription>
        </CardHeader>
        <CardFooter className="text-xs text-muted-foreground">
          <span>{authorName}</span>
          {publishedAt && (
            <>
              <span className="mx-2">·</span>
              <span>{new Date(publishedAt).toLocaleDateString()}</span>
            </>
          )}
        </CardFooter>
      </Card>
    </a>
  );
}
```

- [ ] **Step 2: Create Home page**

Create `apps/web/src/app/page.tsx`:

```tsx
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getPosts } from "@repo/database";
import { PostCard } from "@/components/post-card";

export const revalidate = 60;

export default async function HomePage() {
  const supabase = await createServerSupabaseClient();
  const { data: posts } = await getPosts(supabase, { status: "published", limit: 12 });

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Latest Posts</h1>
      {posts && posts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post: any) => (
            <PostCard
              key={post.id}
              title={post.title}
              slug={post.slug}
              excerpt={post.excerpt}
              coverImage={post.cover_image}
              categoryName={post.categories?.name ?? null}
              authorName={post.profiles?.username ?? "Unknown"}
              publishedAt={post.published_at}
            />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No posts yet.</p>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Create CommentSection client component**

Create `apps/web/src/components/comment-section.tsx`:

```tsx
"use client";

import { useState, useEffect } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { getCommentsByPostId, createComment } from "@repo/database";
import { Button, Input, Avatar, AvatarFallback } from "@repo/ui";

interface CommentSectionProps {
  postId: number;
}

export function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createBrowserSupabaseClient();

  useEffect(() => {
    async function load() {
      const { data } = await getCommentsByPostId(supabase, postId);
      if (data) setComments(data);

      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }
    load();
  }, [postId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setLoading(true);
    const { data } = await createComment(supabase, {
      post_id: postId,
      author_id: user.id,
      content: newComment.trim(),
    });
    if (data) {
      setComments((prev) => [...prev, data]);
      setNewComment("");
    }
    setLoading(false);
  }

  return (
    <section className="mt-12">
      <h2 className="mb-6 text-2xl font-bold">Comments ({comments.length})</h2>

      <div className="space-y-4">
        {comments.map((comment: any) => (
          <div key={comment.id} className="flex gap-3 rounded-lg border p-4">
            <Avatar>
              <AvatarFallback>{comment.profiles?.username?.[0]?.toUpperCase() ?? "?"}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{comment.profiles?.username ?? "Anonymous"}</p>
              <p className="text-sm text-muted-foreground">{new Date(comment.created_at).toLocaleString()}</p>
              <p className="mt-1">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>

      {user ? (
        <form onSubmit={handleSubmit} className="mt-6 flex gap-2">
          <Input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1"
          />
          <Button type="submit" disabled={loading || !newComment.trim()}>
            {loading ? "Posting..." : "Post"}
          </Button>
        </form>
      ) : (
        <p className="mt-6 text-sm text-muted-foreground">
          <a href="/auth/login" className="underline">Log in</a> to leave a comment.
        </p>
      )}
    </section>
  );
}
```

- [ ] **Step 4: Create Post Detail page**

Create `apps/web/src/app/[slug]/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getPostBySlug } from "@repo/database";
import { MarkdownRenderer, Badge, Avatar, AvatarFallback } from "@repo/ui";
import { CommentSection } from "@/components/comment-section";

export const revalidate = 60;

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: post } = await getPostBySlug(supabase, slug);

  if (!post || post.status !== "published") {
    notFound();
  }

  return (
    <article className="mx-auto max-w-3xl">
      {post.cover_image && (
        <img src={post.cover_image} alt={post.title} className="mb-8 w-full rounded-lg object-cover" />
      )}
      <header className="mb-8">
        {(post as any).categories?.name && (
          <Badge variant="secondary" className="mb-2">{(post as any).categories.name}</Badge>
        )}
        <h1 className="text-4xl font-bold">{post.title}</h1>
        <div className="mt-4 flex items-center gap-3">
          <Avatar>
            <AvatarFallback>{(post as any).profiles?.username?.[0]?.toUpperCase() ?? "?"}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{(post as any).profiles?.username ?? "Unknown"}</p>
            {post.published_at && (
              <p className="text-xs text-muted-foreground">{new Date(post.published_at).toLocaleDateString()}</p>
            )}
          </div>
        </div>
      </header>

      <MarkdownRenderer content={post.content} />

      <CommentSection postId={post.id} />
    </article>
  );
}
```

- [ ] **Step 5: Create Category page**

Create `apps/web/src/app/category/[slug]/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getCategoryBySlug, getPosts } from "@repo/database";
import { PostCard } from "@/components/post-card";

export const revalidate = 60;

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: category } = await getCategoryBySlug(supabase, slug);

  if (!category) {
    notFound();
  }

  const { data: posts } = await getPosts(supabase, { status: "published", categoryId: category.id });

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Category: {category.name}</h1>
      {posts && posts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post: any) => (
            <PostCard
              key={post.id}
              title={post.title}
              slug={post.slug}
              excerpt={post.excerpt}
              coverImage={post.cover_image}
              categoryName={null}
              authorName={post.profiles?.username ?? "Unknown"}
              publishedAt={post.published_at}
            />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No posts in this category.</p>
      )}
    </div>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/
git commit -m "feat: add blog pages - home, post detail, category with comments"
```

---

## Task 7: apps/web — Auth Pages

**Files:**
- Create: `apps/web/src/app/auth/login/page.tsx`
- Create: `apps/web/src/app/auth/register/page.tsx`
- Create: `apps/web/src/app/auth/callback/route.ts`

- [ ] **Step 1: Create Login page**

Create `apps/web/src/app/auth/login/page.tsx`:

```tsx
"use client";

import { useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@repo/ui";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createBrowserSupabaseClient();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      window.location.href = "/";
    }
  }

  async function handleGitHubLogin() {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
            <Button type="button" variant="outline" className="w-full" onClick={handleGitHubLogin}>
              Sign in with GitHub
            </Button>
            <p className="text-sm text-muted-foreground">
              Don't have an account? <a href="/auth/register" className="underline">Register</a>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
```

- [ ] **Step 2: Create Register page**

Create `apps/web/src/app/auth/register/page.tsx`:

```tsx
"use client";

import { useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@repo/ui";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createBrowserSupabaseClient();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      await supabase.from("profiles").insert({
        id: data.user.id,
        username,
        role: "reader",
      });
      setSuccess(true);
    }
    setLoading(false);
  }

  if (success) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Check your email</CardTitle>
            <CardDescription>We sent you a confirmation link. Please check your inbox.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>Create a new account</CardDescription>
        </CardHeader>
        <form onSubmit={handleRegister}>
          <CardContent className="space-y-4">
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input type="password" placeholder="Password (min 6 chars)" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </Button>
            <p className="text-sm text-muted-foreground">
              Already have an account? <a href="/auth/login" className="underline">Login</a>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
```

- [ ] **Step 3: Create OAuth callback route**

Create `apps/web/src/app/auth/callback/route.ts`:

```ts
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createServerSupabaseClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(origin);
}
```

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/app/auth/
git commit -m "feat: add auth pages - login, register, OAuth callback"
```

---

## Task 8: apps/admin — Vite + React Admin Dashboard Scaffolding

**Files:**
- Create: `apps/admin/package.json`
- Create: `apps/admin/tsconfig.json`
- Create: `apps/admin/tsconfig.app.json`
- Create: `apps/admin/vite.config.ts`
- Create: `apps/admin/postcss.config.mjs`
- Create: `apps/admin/eslint.config.js`
- Create: `apps/admin/index.html`
- Create: `apps/admin/src/main.tsx`
- Create: `apps/admin/src/index.css`
- Create: `apps/admin/src/App.tsx`
- Create: `apps/admin/src/lib/supabase.ts`
- Create: `apps/admin/src/router.tsx`
- Create: `apps/admin/src/components/auth-guard.tsx`
- Create: `apps/admin/src/components/admin-layout.tsx`

- [ ] **Step 1: Create apps/admin/package.json**

```json
{
  "name": "@repo/admin",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite --port 3001",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "react": "^19",
    "react-dom": "^19",
    "react-router-dom": "^7",
    "@uiw/react-md-editor": "^4",
    "@repo/ui": "workspace:*",
    "@repo/database": "workspace:*"
  },
  "devDependencies": {
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@vitejs/plugin-react": "^4",
    "typescript": "^5",
    "vite": "^6",
    "tailwindcss": "^4",
    "@tailwindcss/postcss": "^4",
    "@tailwindcss/vite": "^4",
    "postcss": "^8",
    "@eslint/js": "^9",
    "typescript-eslint": "^8",
    "eslint": "^9",
    "@repo/config": "workspace:*"
  }
}
```

- [ ] **Step 2: Create apps/admin/vite.config.ts**

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

- [ ] **Step 3: Create apps/admin/tsconfig.json**

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" }
  ]
}
```

- [ ] **Step 4: Create apps/admin/tsconfig.app.json**

```json
{
  "extends": "@repo/config/tsconfig/vite.json",
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"]
}
```

- [ ] **Step 5: Create apps/admin/postcss.config.mjs**

```js
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

- [ ] **Step 6: Create apps/admin/eslint.config.js**

```js
import baseConfig from "@repo/config/eslint/base.js";

export default [
  ...baseConfig,
  {
    ignores: ["dist/"],
  },
];
```

- [ ] **Step 7: Create apps/admin/index.html**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Blog Admin</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 8: Create apps/admin/src/index.css**

```css
@import "tailwindcss";
@import "@repo/ui/globals.css";

@config "../../node_modules/@repo/ui/tailwind.config.ts";
```

Note: Same as the web app — adjust import paths if needed during implementation.

- [ ] **Step 9: Create apps/admin/src/lib/supabase.ts**

```ts
import { createSupabaseClient } from "@repo/database";

export const supabase = createSupabaseClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
```

Update `.env.example` to also include:

```
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

- [ ] **Step 10: Create apps/admin/src/components/auth-guard.tsx**

```tsx
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { isAdmin } from "@repo/database";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<"loading" | "authorized" | "unauthorized">("loading");

  useEffect(() => {
    async function check() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setState("unauthorized");
        return;
      }
      const admin = await isAdmin(supabase, user.id);
      setState(admin ? "authorized" : "unauthorized");
    }
    check();
  }, []);

  if (state === "loading") return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (state === "unauthorized") return <Navigate to="/login" replace />;
  return <>{children}</>;
}
```

- [ ] **Step 11: Create apps/admin/src/components/admin-layout.tsx**

```tsx
import { NavLink, Outlet } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@repo/ui";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/posts", label: "Posts" },
  { to: "/comments", label: "Comments" },
  { to: "/media", label: "Media" },
];

export function AdminLayout() {
  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <div className="flex h-screen">
      <aside className="w-64 border-r bg-muted/30 p-4">
        <h1 className="mb-8 text-xl font-bold">Blog Admin</h1>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `block rounded-md px-3 py-2 text-sm transition-colors ${
                  isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto pt-8">
          <Button variant="ghost" className="w-full" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
```

- [ ] **Step 12: Create apps/admin/src/router.tsx**

```tsx
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
```

- [ ] **Step 13: Create apps/admin/src/App.tsx**

```tsx
import { RouterProvider } from "react-router-dom";
import { router } from "./router";

export default function App() {
  return <RouterProvider router={router} />;
}
```

- [ ] **Step 14: Create apps/admin/src/main.tsx**

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

- [ ] **Step 15: Commit**

```bash
git add apps/admin/
git commit -m "feat: scaffold Vite admin dashboard with auth guard and routing"
```

---

## Task 9: apps/admin — Admin Pages (Login, Dashboard, Posts, Comments, Media)

**Files:**
- Create: `apps/admin/src/pages/login.tsx`
- Create: `apps/admin/src/pages/dashboard.tsx`
- Create: `apps/admin/src/pages/posts.tsx`
- Create: `apps/admin/src/pages/post-editor.tsx`
- Create: `apps/admin/src/pages/comments.tsx`
- Create: `apps/admin/src/pages/media.tsx`

- [ ] **Step 1: Create Login page**

Create `apps/admin/src/pages/login.tsx`:

```tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { isAdmin } from "@repo/database";
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@repo/ui";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    const admin = await isAdmin(supabase, data.user.id);
    if (!admin) {
      setError("You do not have admin access.");
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }

    navigate("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
          <CardDescription>Sign in to manage your blog</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
```

- [ ] **Step 2: Create Dashboard page**

Create `apps/admin/src/pages/dashboard.tsx`:

```tsx
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
```

- [ ] **Step 3: Create Posts management page**

Create `apps/admin/src/pages/posts.tsx`:

```tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { getPosts, deletePost } from "@repo/database";
import {
  Button, Badge,
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@repo/ui";

export default function PostsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      const { data } = await getPosts(supabase);
      if (data) setPosts(data);
    }
    load();
  }, []);

  async function handleDelete() {
    if (deleteId === null) return;
    await deletePost(supabase, deleteId);
    setPosts((prev) => prev.filter((p) => p.id !== deleteId));
    setDeleteId(null);
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Posts</h1>
        <Button asChild>
          <Link to="/posts/new">New Post</Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id}>
              <TableCell className="font-medium">{post.title}</TableCell>
              <TableCell>
                <Badge variant={post.status === "published" ? "default" : "secondary"}>
                  {post.status}
                </Badge>
              </TableCell>
              <TableCell>{new Date(post.created_at).toLocaleDateString()}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={`/posts/${post.id}/edit`}>Edit</Link>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setDeleteId(post.id)}>
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Post?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
```

- [ ] **Step 4: Create Post Editor page**

Create `apps/admin/src/pages/post-editor.tsx`:

```tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";
import { supabase } from "@/lib/supabase";
import { getPostBySlug, createPost, updatePost } from "@repo/database";
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
        const { data } = await supabase.from("posts").select("*").eq("id", Number(id)).single();
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
```

- [ ] **Step 5: Create Comments management page**

Create `apps/admin/src/pages/comments.tsx`:

```tsx
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
              <TableCell>{comment.posts?.title ?? "—"}</TableCell>
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
```

- [ ] **Step 6: Create Media Library page**

Create `apps/admin/src/pages/media.tsx`:

```tsx
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
```

- [ ] **Step 7: Install dependencies and verify dev server**

Run: `pnpm install`
Run: `pnpm --filter @repo/admin dev`
Expected: Vite dev server starts on http://localhost:3001.

- [ ] **Step 8: Commit**

```bash
git add apps/admin/src/pages/
git commit -m "feat: add admin pages - login, dashboard, posts, comments, media"
```

---

## Task 10: Supabase Database Setup (SQL Migration)

**Files:**
- Create: `supabase/migrations/001_initial_schema.sql`

- [ ] **Step 1: Create migration file**

Create `supabase/migrations/001_initial_schema.sql`:

```sql
-- Profiles (extends Supabase auth.users)
CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username    TEXT UNIQUE NOT NULL,
  avatar_url  TEXT,
  role        TEXT DEFAULT 'reader' CHECK (role IN ('admin', 'reader')),
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Categories
CREATE TABLE categories (
  id          SERIAL PRIMARY KEY,
  name        TEXT UNIQUE NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Posts
CREATE TABLE posts (
  id            SERIAL PRIMARY KEY,
  title         TEXT NOT NULL,
  slug          TEXT UNIQUE NOT NULL,
  content       TEXT NOT NULL,
  excerpt       TEXT,
  cover_image   TEXT,
  category_id   INT REFERENCES categories(id) ON DELETE SET NULL,
  author_id     UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status        TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- Tags
CREATE TABLE tags (
  id    SERIAL PRIMARY KEY,
  name  TEXT UNIQUE NOT NULL
);

-- Post-Tag junction
CREATE TABLE post_tags (
  post_id INT REFERENCES posts(id) ON DELETE CASCADE,
  tag_id  INT REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- Comments (nested replies via parent_id)
CREATE TABLE comments (
  id          SERIAL PRIMARY KEY,
  post_id     INT REFERENCES posts(id) ON DELETE CASCADE,
  author_id   UUID REFERENCES profiles(id) ON DELETE SET NULL,
  content     TEXT NOT NULL,
  parent_id   INT REFERENCES comments(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_category ON posts(category_id);
CREATE INDEX idx_comments_post ON comments(post_id);

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;

-- Profiles: anyone can read, users update own
CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Posts: anyone can read published, admin can all
CREATE POLICY "posts_select" ON posts FOR SELECT USING (
  status = 'published' OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "posts_insert" ON posts FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "posts_update" ON posts FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "posts_delete" ON posts FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Comments: authenticated can create, author or admin can delete
CREATE POLICY "comments_select" ON comments FOR SELECT USING (true);
CREATE POLICY "comments_insert" ON comments FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "comments_delete" ON comments FOR DELETE USING (
  author_id = auth.uid() OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Categories: anyone can read, admin can manage
CREATE POLICY "categories_select" ON categories FOR SELECT USING (true);
CREATE POLICY "categories_insert" ON categories FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "categories_delete" ON categories FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Tags: anyone can read, admin can manage
CREATE POLICY "tags_select" ON tags FOR SELECT USING (true);
CREATE POLICY "tags_insert" ON tags FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Post tags: same as posts
CREATE POLICY "post_tags_select" ON post_tags FOR SELECT USING (true);
CREATE POLICY "post_tags_insert" ON post_tags FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "post_tags_delete" ON post_tags FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, username, role)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'username', NEW.email), 'reader');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Storage bucket for post images
INSERT INTO storage.buckets (id, name, public) VALUES ('post-images', 'post-images', true);

-- Storage policies
CREATE POLICY "post_images_select" ON storage.objects FOR SELECT USING (bucket_id = 'post-images');
CREATE POLICY "post_images_insert" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'post-images' AND
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "post_images_delete" ON storage.objects FOR DELETE USING (
  bucket_id = 'post-images' AND
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
```

- [ ] **Step 2: Commit**

```bash
git add supabase/
git commit -m "feat: add Supabase migration with tables, RLS policies, and storage"
```

Note: To apply this migration, run in Supabase Dashboard SQL editor or via `supabase db push` if using Supabase CLI locally.

---

## Task 11: GitHub Actions CI/CD Workflow

**Files:**
- Create: `.github/workflows/ci.yml`

- [ ] **Step 1: Create CI/CD workflow**

Create `.github/workflows/ci.yml`:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
  NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
  VITE_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
  VITE_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}

jobs:
  lint-and-typecheck:
    name: Lint & Type Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 10

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: "pnpm"

      - run: pnpm install --frozen-lockfile

      - name: Lint
        run: pnpm lint

      - name: Type Check
        run: pnpm typecheck

  build:
    name: Build
    needs: lint-and-typecheck
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 10

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: "pnpm"

      - run: pnpm install --frozen-lockfile

      - name: Build all apps
        run: pnpm build

  deploy-web:
    name: Deploy Blog (Vercel)
    needs: build
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 10

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: "pnpm"

      - run: pnpm install --frozen-lockfile

      - name: Install Vercel CLI
        run: pnpm add -g vercel

      - name: Pull Vercel Environment
        run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
        working-directory: apps/web

      - name: Build for Vercel
        run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}
        working-directory: apps/web

      - name: Deploy to Vercel
        run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
        working-directory: apps/web

  deploy-admin:
    name: Deploy Admin (Vercel)
    needs: build
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 10

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: "pnpm"

      - run: pnpm install --frozen-lockfile

      - name: Install Vercel CLI
        run: pnpm add -g vercel

      - name: Pull Vercel Environment
        run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
        working-directory: apps/admin

      - name: Build for Vercel
        run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}
        working-directory: apps/admin

      - name: Deploy to Vercel
        run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
        working-directory: apps/admin
```

- [ ] **Step 2: Commit**

```bash
git add .github/
git commit -m "ci: add GitHub Actions workflow for lint, build, and Vercel deployment"
```

---

## Task 12: Verify Full Build & Final Commit

**Files:**
- No new files. Verify everything works together.

- [ ] **Step 1: Install all dependencies**

Run: `pnpm install`
Expected: All packages install cleanly.

- [ ] **Step 2: Run lint**

Run: `pnpm lint`
Expected: No errors. Fix any lint issues found.

- [ ] **Step 3: Run typecheck**

Run: `pnpm typecheck`
Expected: No type errors. Fix any type issues found.

- [ ] **Step 4: Run build**

Run: `pnpm build`
Expected: Both apps build successfully. `apps/web/.next/` and `apps/admin/dist/` directories created.

- [ ] **Step 5: Test dev mode**

Run: `pnpm dev`
Expected: Both apps start — web on port 3000, admin on port 3001.

- [ ] **Step 6: Fix any issues found and commit**

```bash
git add -A
git commit -m "fix: resolve build issues found during full verification"
```

- [ ] **Step 7: Final commit if all clean**

If no fixes were needed in Step 6:

```bash
git add -A
git commit -m "chore: verify full monorepo build passes"
```

---

## Summary

| Task | Description | Dependencies |
|------|-------------|-------------|
| 1 | Monorepo root scaffolding | None |
| 2 | @repo/config package | Task 1 |
| 3 | @repo/database package | Task 1, 2 |
| 4 | @repo/ui package | Task 1, 2 |
| 5 | Next.js blog scaffolding | Task 2, 3, 4 |
| 6 | Blog pages (home, post, category) | Task 5 |
| 7 | Auth pages | Task 5 |
| 8 | Vite admin scaffolding | Task 2, 3, 4 |
| 9 | Admin pages | Task 8 |
| 10 | Supabase SQL migration | None (can be parallel) |
| 11 | GitHub Actions CI/CD | Task 1 |
| 12 | Full build verification | All tasks |

**Parallelizable groups:**
- Tasks 3 and 4 can run in parallel (both depend on 1+2)
- Tasks 5-7 and 8-9 can run in parallel (web vs admin)
- Task 10 and 11 can run in parallel with anything
