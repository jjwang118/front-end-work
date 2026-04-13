interface PostCardProps {
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  categoryName: string | null;
  authorName: string;
  publishedAt: string | null;
  index?: number;
}

export function PostCard({
  title,
  slug,
  excerpt,
  coverImage,
  categoryName,
  authorName,
  publishedAt,
  index = 0,
}: PostCardProps) {
  return (
    <a
      href={`/${slug}`}
      className="glass-card group block overflow-hidden rounded-2xl transition-all hover-lift"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(16px)",
        animation: "fadeSlideUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        animationDelay: `${200 + index * 80}ms`,
        opacity: 0,
      }}
    >
      {/* Cover image */}
      {coverImage && (
        <div className="aspect-video overflow-hidden">
          <img
            src={coverImage}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        {categoryName && (
          <span
            className="mb-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium"
            style={{
              background: "rgba(232,168,56,0.1)",
              color: "#e8a838",
            }}
          >
            {categoryName}
          </span>
        )}
        <h2
          className="mb-2 text-lg font-bold leading-snug transition-colors"
          style={{
            fontFamily: "var(--font-display)",
            color: "#f5f0e8",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#e8a838")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#f5f0e8")}
        >
          {title}
        </h2>
        {excerpt && (
          <p
            className="mb-3 line-clamp-2 text-sm leading-relaxed"
            style={{ color: "#9a948a" }}
          >
            {excerpt}
          </p>
        )}
        <div
          className="flex items-center gap-2 text-xs"
          style={{ color: "#9a948a" }}
        >
          <span>{authorName}</span>
          {publishedAt && (
            <>
              <span>·</span>
              <span>
                {new Date(publishedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </>
          )}
        </div>
      </div>
    </a>
  );
}
