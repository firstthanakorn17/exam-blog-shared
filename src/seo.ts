import type { Post, SiteSettings } from "./types";

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\u0E00-\u0E7F\s-]/g, "")
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
      const id = slugify(text) || `section-${headings.length + 1}`;
      headings.push({ id, text, level });
    }
  }
  return headings;
}

export function extractKeywordsList(post: Post, categoryName?: string): string[] {
  const raw = post.focusKeyword
    ? post.focusKeyword.split(",").map((k) => k.trim()).filter(Boolean)
    : [];
  const extras = [
    categoryName || post.categorySlug,
    "Next.js 16",
    "App Router",
    "Web Development",
  ].filter(Boolean);
  return Array.from(new Set([...raw, ...extras]));
}

export function buildBlogPostingJsonLd(
  post: Post,
  settings?: SiteSettings,
  categoryName?: string
) {
  const baseUrl = (settings?.siteUrl || "http://localhost:3002").replace(
    /\/$/,
    ""
  );
  const canonical = post.canonicalUrl || `${baseUrl}/blog/${post.slug}`;
  const ogImageUrl = `${baseUrl}/blog/${post.slug}/opengraph-image`;
  const effectiveTitle = (post.seoTitle || post.title).trim();
  const effectiveDesc = (post.seoDescription || post.excerpt).trim();
  const stats = calculateReadingStats(post.content);
  const headings = extractHeadings(post.content);
  const keywords = extractKeywordsList(post, categoryName);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["BlogPosting", "TechArticle"],
        "@id": `${canonical}#article`,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": canonical,
        },
        headline: effectiveTitle,
        alternativeHeadline: post.title,
        description: effectiveDesc,
        image: [
          {
            "@type": "ImageObject",
            url: ogImageUrl,
            width: 1200,
            height: 630,
          },
        ],
        inLanguage: "th-TH",
        isAccessibleForFree: true,
        articleSection: categoryName || post.categorySlug,
        keywords: keywords.join(", "),
        wordCount: stats.words,
        timeRequired: `PT${stats.minutes}M`,
        datePublished: post.createdAt,
        dateModified: post.updatedAt,
        author: {
          "@type": "Person",
          name: post.author,
          url: `${baseUrl}/search?q=${encodeURIComponent(post.author)}`,
        },
        publisher: {
          "@type": "Organization",
          name: settings?.siteName || "NextBlog",
          url: baseUrl,
        },
        interactionStatistic: [
          {
            "@type": "InteractionCounter",
            interactionType: "https://schema.org/ReadAction",
            userInteractionCount: post.views,
          },
          {
            "@type": "InteractionCounter",
            interactionType: "https://schema.org/LikeAction",
            userInteractionCount: post.claps ?? 18,
          },
        ],
        hasPart: headings.map((h) => ({
          "@type": "WebPageElement",
          name: h.text,
          url: `${canonical}#${h.id}`,
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonical}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "หน้าแรก",
            item: baseUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: categoryName || post.categorySlug,
            item: `${baseUrl}/category/${post.categorySlug}`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: post.title,
            item: canonical,
          },
        ],
      },
    ],
  };
}

export function buildWebSiteJsonLd(settings: SiteSettings, posts: Post[]) {
  const baseUrl = (settings.siteUrl || "http://localhost:3002").replace(
    /\/$/,
    ""
  );

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        url: baseUrl,
        name: settings.siteName,
        alternateName: settings.tagline,
        description: settings.defaultSeoDescription,
        inLanguage: "th-TH",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${baseUrl}/search?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${baseUrl}/#organization`,
        name: settings.siteName,
        url: baseUrl,
        description: settings.defaultSeoDescription,
      },
      {
        "@type": "ItemList",
        "@id": `${baseUrl}/#featured-posts`,
        name: `บทความล่าสุดจาก ${settings.siteName}`,
        itemListElement: posts.slice(0, 10).map((post, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          url: `${baseUrl}/blog/${post.slug}`,
          name: post.title,
        })),
      },
    ],
  };
}

export function buildCategoryJsonLd(
  categoryName: string,
  categorySlug: string,
  description: string,
  posts: Post[],
  settings?: SiteSettings
) {
  const baseUrl = (settings?.siteUrl || "http://localhost:3002").replace(
    /\/$/,
    ""
  );
  const categoryUrl = categorySlug
    ? `${baseUrl}/category/${categorySlug}`
    : `${baseUrl}/category`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${categoryUrl}#collection`,
        url: categoryUrl,
        name: `${categoryName} — คลังบทความและคู่มือเชิงลึก`,
        description,
        inLanguage: "th-TH",
        isPartOf: {
          "@id": `${baseUrl}/#website`,
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${categoryUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "หน้าแรก",
            item: baseUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "หมวดหมู่ทั้งหมด",
            item: `${baseUrl}/category`,
          },
          ...(categorySlug
            ? [
                {
                  "@type": "ListItem",
                  position: 3,
                  name: categoryName,
                  item: categoryUrl,
                },
              ]
            : []),
        ],
      },
      {
        "@type": "ItemList",
        itemListElement: posts.slice(0, 12).map((post, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          url: `${baseUrl}/blog/${post.slug}`,
          name: post.title,
        })),
      },
    ],
  };
}
