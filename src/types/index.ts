export interface ProjectDTO {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  description: string;
  bannerImage: string;
  tags: string;
  liveUrl: string | null;
  githubUrl: string | null;
  figmaUrl: string | null;
  order: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectInput {
  title: string;
  slug?: string;
  subtitle?: string;
  description: string;
  bannerImage: string;
  tags?: string;
  liveUrl?: string;
  githubUrl?: string;
  figmaUrl?: string;
  order?: number;
  published?: boolean;
}

export interface WritingDTO {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string | null;
  pdfUrl: string | null;
  coverImage: string | null;
  tags: string;
  externalUrl: string | null;
  publishedAt: string;
  order: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WritingInput {
  title: string;
  slug?: string;
  excerpt: string;
  content?: string;
  pdfUrl?: string;
  coverImage?: string;
  tags?: string;
  externalUrl?: string;
  publishedAt?: string;
  order?: number;
  published?: boolean;
}
