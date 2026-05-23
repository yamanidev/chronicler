import type { SUPPORTED_PLATFORMS } from "./constants";

export type Platform = keyof typeof SUPPORTED_PLATFORMS;

export type Post = {
  title: string;
  slug: string;
  text: string;
  attachments: File[];
  categories: string[];
  links: Partial<Record<Platform, string>>;
};

export type PostFormData = {
  title: string;
  text: string;
  attachments: File[];
  categories: string[];
  links: Partial<Record<Platform, string>>;
};
