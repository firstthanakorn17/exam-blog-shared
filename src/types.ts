export type PostStatus = "draft" | "published" | "archived";

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  categorySlug: string;
  status: PostStatus;
  featured: boolean;
  views: number;
  claps?: number;
  author: string;
  updatedAt: string;
  createdAt: string;
  seoTitle?: string;
  seoDescription?: string;
  focusKeyword?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentSlug: string | null;
  description: string;
}

export interface CommentItem {
  id: string;
  postSlug: string;
  author: string;
  body: string;
  createdAt: string;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  postsPerPage: number;
  maintenanceMode: boolean;
  allowComments: boolean;
  defaultSeoDescription: string;
  siteUrl?: string;
  twitterHandle?: string;
}
