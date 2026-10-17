import type { Post, SiteSettings } from "./types";

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export function calculateReadingStats(content: string): {
  words: number;
  minutes: number;
} {
  const cleaned = (content || "").trim();
  if (!cleaned) return { words: 0, minutes: 1 };
  const spaceTokens = cleaned.split(/\s+/).filter(Boolean).length;
  const charEstimate = Math.ceil(cleaned.length / 6);
  const words = Math.max(spaceTokens, charEstimate);
  const minutes = Math.max(1, Math.ceil(words / 200));
  return { words, minutes };
}

export function extractHeadings(
  markdown: string
): Array<{ id: string; text: string; level: number }> {
  const lines = (markdown || "").split("\n");
  const headings: Array<{ id: string; text: string; level: number }> = [];
  for (const line of lines) {
    const match = /^(#{1,3})\s+(.+)$/.exec(line.trim());
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      const id =
        slugify(text) || `heading-${headings.length + 1}`;
      headings.push({ id, text, level });
    }
  }
  return headings;
}

export function buildBlogPostingJsonLd(post: Post, settings?: SiteSettings) {
  const baseUrl = (settings?.siteUrl || "https://nextblog.example.com").replace(
    /\/$/,
    ""
  );
  const effectiveTitle = (post.seoTitle || post.title).trim();
  const effectiveDesc = (post.seoDescription || post.excerpt).trim();

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: effectiveTitle,
    description: effectiveDesc,
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: settings?.siteName || "NextBlog",
    },
    datePublished: post.createdAt,
    dateModified: post.updatedAt,
    keywords: post.focusKeyword || post.categorySlug,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": post.canonicalUrl || `${baseUrl}/blog/${post.slug}`,
    },
  };
}
