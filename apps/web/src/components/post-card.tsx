import { Card, CardHeader, CardTitle, CardDescription, CardFooter, Badge } from "@repo/ui";

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
