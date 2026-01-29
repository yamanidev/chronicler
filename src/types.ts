import type { SUPPORTED_PLATFORMS } from "./constants";

export type Platform = keyof typeof SUPPORTED_PLATFORMS;

export type Post = {
  title: string;
  slug: string;
  content: string;
  attachments: File[];
  categories: string[];
  platforms: Platform[];
  links?: Record<Platform, string>;
};

export type PostFormData = {
  title: string;
  content: string;
  attachments: File[];
  categories: string[];
  platforms: Platform[];
};
