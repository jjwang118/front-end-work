# Personal Blog/CMS Full-Stack Project Design

## Overview

A full-stack personal blog/CMS built with a monorepo architecture, featuring a Next.js public blog frontend and a Vite + React admin dashboard, backed by Supabase. Deployed via GitHub Actions CI/CD to Vercel.

**Tech Stack**: pnpm + Turborepo + Next.js 15 + Vite + React + Supabase + shadcn/ui + Tailwind CSS

**Focus**: Architecture and tech stack demonstration for coursework.

---

## 1. Monorepo Architecture

```
front-end-work/
├── apps/
│   ├── web/                    # Next.js 15 Blog Frontend (App Router, SSR/SSG)
│   └── admin/                  # Vite + React Admin Dashboard (SPA)
├── packages/
│   ├── ui/                     # Shared UI Components (shadcn + Tailwind)
│   ├── database/               # Supabase Client + Types + Data Operations
│   └── config/                 # Shared ESLint, TypeScript, Tailwind Config
├── .github/workflows/ci.yml   # GitHub Actions CI/CD
├── turbo.json                  # Turborepo Configuration
├── pnpm-workspace.yaml         # pnpm Workspace Configuration
├── package.json                # Root package.json
└── .env.example                # Environment Variables Template
```

### Package Naming

- `@repo/ui` — shared UI component library
- `@repo/database` — Supabase data layer
- `@repo/config` — shared configs (ESLint, TypeScript, Tailwind)

### Key Design Decisions

- `@repo/ui` enables both apps to share the same shadcn component set, avoiding duplication.
- `@repo/database` encapsulates all Supabase interactions; both apps share type definitions and data operations.
- `@repo/config` centralizes linting and TypeScript configs for consistent code standards.

---

## 2. Database Design (Supabase)

### Tables

```sql
-- Extended user profiles (auth.users managed by Supabase Auth)
CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id),
  username    TEXT UNIQUE NOT NULL,
  avatar_url  TEXT,
  role        TEXT DEFAULT 'reader',  -- 'admin' | 'reader'
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
  id          SERIAL PRIMARY KEY,
  title       TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  content     TEXT NOT NULL,           -- Markdown content
  excerpt     TEXT,                    -- Summary
  cover_image TEXT,                    -- Cover image URL
  category_id INT REFERENCES categories(id),
  author_id   UUID REFERENCES profiles(id),
  status      TEXT DEFAULT 'draft',    -- 'draft' | 'published'
  published_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- Tags
CREATE TABLE tags (
  id          SERIAL PRIMARY KEY,
  name        TEXT UNIQUE NOT NULL
);

-- Post-Tag junction table
CREATE TABLE post_tags (
  post_id     INT REFERENCES posts(id) ON DELETE CASCADE,
  tag_id      INT REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- Comments (supports nested replies)
CREATE TABLE comments (
  id          SERIAL PRIMARY KEY,
  post_id     INT REFERENCES posts(id) ON DELETE CASCADE,
  author_id   UUID REFERENCES profiles(id),
  content     TEXT NOT NULL,
  parent_id   INT REFERENCES comments(id),
  created_at  TIMESTAMPTZ DEFAULT now()
);
```

### Row Level Security (RLS) Policies

- **posts**: Anyone can read published posts. Only admin can create/update/delete.
- **comments**: Logged-in users can create. Only the comment author and admin can delete.
- **profiles**: Anyone can read all profiles. Users can only update their own.

### Storage

- **Bucket `post-images`**: Article cover images and inline images. Admin can upload; everyone can read.

---

## 3. Blog Frontend (apps/web) — Next.js 15

### Pages

| Page | Route | Rendering | Description |
|------|-------|-----------|-------------|
| Home | `/` | SSG + ISR | Post list with pagination, filter by category/tag |
| Post Detail | `/[slug]` | SSG + ISR | Markdown rendering, comment section |
| Category | `/category/[slug]` | SSG | Posts filtered by category |
| Login | `/auth/login` | CSR | Supabase Auth UI, GitHub OAuth |
| Register | `/auth/register` | CSR | Email registration |

### Technical Details

- Next.js App Router with Server Components
- `generateStaticParams` for SSG + `revalidate` for ISR (Incremental Static Regeneration)
- Comment section as Client Component with real-time loading
- Markdown rendering: `react-markdown` + `rehype-highlight` for code syntax highlighting

---

## 4. Admin Dashboard (apps/admin) — Vite + React

### Pages

| Page | Route | Description |
|------|-------|-------------|
| Login | `/login` | Admin login |
| Dashboard | `/dashboard` | Post count, comment count, basic stats |
| Post Management | `/posts` | Post list with search/filter |
| Post Editor | `/posts/new`, `/posts/:id/edit` | Markdown editor with image upload |
| Comment Management | `/comments` | Comment list with delete capability |
| Media Library | `/media` | Image management, upload/delete |

### Technical Details

- React Router v6 for routing
- Route guards: check Supabase session + admin role
- Markdown editor: `@uiw/react-md-editor`
- Image upload to Supabase Storage, returns public URL for embedding in posts

---

## 5. Shared UI Components (packages/ui)

Based on shadcn/ui, shared between both apps:

- `Button`, `Input`, `Card`, `Dialog`, `Table`, `Badge`, `Avatar`, `Dropdown`
- `Pagination` component
- `MarkdownRenderer` component (used by blog frontend)

The package exports Tailwind CSS config as a preset so both apps have consistent styling.

---

## 6. CI/CD & Deployment

### GitHub Actions Workflow

```yaml
name: CI/CD Pipeline
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint-and-typecheck:
    runs-on: ubuntu-latest
    steps:
      - checkout
      - setup pnpm (with cache)
      - pnpm install
      - turbo lint
      - turbo typecheck

  build:
    needs: lint-and-typecheck
    runs-on: ubuntu-latest
    steps:
      - turbo build (parallel build all apps)

  deploy-web:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - Vercel CLI deploy apps/web

  deploy-admin:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - Vercel CLI deploy apps/admin
```

### CI/CD Features

- **Turborepo caching**: Leverages remote cache for faster CI, only rebuilds changed packages.
- **Parallel jobs**: Lint and typecheck run first; build only after they pass.
- **Conditional deployment**: Only pushes to main trigger deployment; PRs only run checks and build.
- **Independent deployments**: web and admin deploy as separate Vercel projects.

### Turborepo Configuration

```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "lint": {},
    "typecheck": {},
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

### Environment Variables

```
# .env.example (committed to git as template)
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # server-side only
```

Actual values configured in Vercel environment settings and GitHub Secrets.

---

## 7. Authentication Flow

1. User clicks login on blog frontend or admin dashboard.
2. Supabase Auth handles authentication (email/password or GitHub OAuth).
3. On success, Supabase returns a JWT session.
4. `@repo/database` provides a shared `getSession()` / `getUser()` helper.
5. Blog frontend: session used for commenting.
6. Admin dashboard: session + role check (`role === 'admin'`) for access control.

---

## 8. Key Dependencies

| Package | Purpose | Used In |
|---------|---------|---------|
| `next` 15 | Blog frontend framework | apps/web |
| `vite` + `react` | Admin dashboard framework | apps/admin |
| `@supabase/supabase-js` | Supabase client SDK | packages/database |
| `@supabase/ssr` | Supabase SSR helpers for Next.js | apps/web |
| `shadcn/ui` | UI component primitives | packages/ui |
| `tailwindcss` | Utility-first CSS | packages/ui, apps/* |
| `react-markdown` | Markdown rendering | packages/ui |
| `rehype-highlight` | Code syntax highlighting | packages/ui |
| `react-router-dom` v6 | SPA routing | apps/admin |
| `@uiw/react-md-editor` | Markdown editor | apps/admin |
| `turbo` | Monorepo build orchestration | root |

---

## 9. Development Workflow

```bash
# Install all dependencies
pnpm install

# Start all apps in dev mode (Turborepo orchestrates)
pnpm dev

# Build all apps
pnpm build

# Lint all packages
pnpm lint

# Type check all packages
pnpm typecheck

# Generate Supabase types
pnpm --filter @repo/database generate-types
```
