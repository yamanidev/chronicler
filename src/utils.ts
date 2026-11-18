import { SUPPORTED_PLATFORMS } from "./constants";
import type { Platform, Post } from "./types";

// Arabic harakat, superscript alef and Quranic annotation marks, plus tatweel.
const ARABIC_DIACRITICS_AND_TATWEEL = /[ً-ٰٟۖ-ۭـ]/g;
const MAXIMUM_SLUG_CHARACTERS = 80;
// Linux limits a folder name to 255 bytes, and the date prefix uses 11 of them.
const MAXIMUM_SLUG_BYTES = 200;

function truncateSlug(slug: string): string {
  const encoder = new TextEncoder();
  let truncated = "";
  let characterCount = 0;
  for (const { segment } of new Intl.Segmenter().segment(slug)) {
    const candidate = truncated + segment;
    if (
      characterCount === MAXIMUM_SLUG_CHARACTERS ||
      encoder.encode(candidate).length > MAXIMUM_SLUG_BYTES
    ) {
      break;
    }

    truncated = candidate;
    characterCount++;
  }

  return truncated;
}

export function slugify(text: string): string {
  const slug = text
    .toLowerCase()
    // One encoding per character, so typed and pasted titles produce the same slug.
    .normalize("NFC")
    .replace(ARABIC_DIACRITICS_AND_TATWEEL, "")
    // Marks only survive attached to a letter, which drops emoji variation selectors.
    .replace(/(?<![\p{L}\p{M}])\p{M}+/gu, "")
    .replace(/[^\p{L}\p{M}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");

  return truncateSlug(slug).replace(/-+$/, "");
}

export function formatDate(date: Date): string {
  return date.toISOString();
}

export function getDatePrefix(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function generateMarkdown(post: Post): string {
  const platformsYaml = (Object.keys(SUPPORTED_PLATFORMS) as (keyof typeof SUPPORTED_PLATFORMS)[])
    .map((platform) => {
      const url = post.links?.[platform] || "";
      return `${platform}: ${url}`;
    })
    .join("\n");

  const categoriesYaml = `[${post.categories.join(", ")}]`;

  let markdown = `---
date: ${formatDate(new Date())}
categories: ${categoriesYaml}
${platformsYaml}
---

${post.text}`;

  if (post.attachments.length > 0) {
    markdown += "\n\n## Attachments\n";
    post.attachments.forEach((file) => {
      const isImage = file.type.startsWith("image/");
      if (isImage) {
        markdown += `![${file.name}](${file.name})\n`;
      } else {
        markdown += `- ${file.name}\n`;
      }
    });
  }

  return markdown;
}

export function getTweetLength(text: string): number {
  // Loosely based on the official documentation
  // https://docs.x.com/fundamentals/counting-characters
  const urlReplaced = text.replace(/https?:\/\/\S+/g, "_".repeat(23));
  const segmenter = new Intl.Segmenter();
  let count = 0;
  for (const { segment } of segmenter.segment(urlReplaced)) {
    count += /\p{Emoji_Presentation}/u.test(segment) ? 2 : 1;
  }

  return count;
}

export function validatePlatformUrl(platform: Platform, url: string): boolean {
  try {
    const { hostname, pathname, searchParams } = new URL(url);
    const baseDomain = hostname.split(".").slice(-2).join(".");
    switch (platform) {
      case "facebook":
        return (
          (baseDomain === "facebook.com" || baseDomain === "fb.com") &&
          (pathname.startsWith("/share/p/") ||
            /^\/[^/]+\/posts\//.test(pathname) ||
            /^\/groups\/[^/]+\/(posts|permalink)\/[^/]+/.test(pathname) ||
            (/^\/(permalink|story)\.php$/.test(pathname) && searchParams.has("story_fbid")))
        );

      case "twitter":
        return (
          (baseDomain === "x.com" || baseDomain === "twitter.com") &&
          /^\/(i\/web|[^/]+)\/status\/\d+/.test(pathname)
        );

      case "linkedin":
        // lnkd.in also shortens outbound links to other sites, so only its post path is accepted.
        if (hostname === "lnkd.in") {
          return pathname.startsWith("/p/");
        }

        return (
          baseDomain === "linkedin.com" &&
          (pathname.startsWith("/posts/") ||
            pathname.startsWith("/pulse/") ||
            /^\/(embed\/)?feed\/update\/urn:li:(activity|share|ugcPost):\d+/.test(pathname))
        );
    }
  } catch {
    return false;
  }
}

export const isFileSystemAccessSupported = typeof window.showDirectoryPicker === "function";

export async function copyToClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
    throw new Error("Failed to copy to clipboard");
  }
}

export class ArchiveDirectoryTakenError extends Error {
  readonly directoryName: string;

  constructor(directoryName: string) {
    super(`An archive folder named "${directoryName}" already exists`);
    this.name = "ArchiveDirectoryTakenError";
    this.directoryName = directoryName;
  }
}

async function entryExists(directoryHandle: FileSystemDirectoryHandle, name: string) {
  try {
    await directoryHandle.getDirectoryHandle(name);

    return true;
  } catch (error) {
    if (error instanceof DOMException && error.name === "NotFoundError") {
      return false;
    }

    // A file rather than a folder already uses this name.
    if (error instanceof DOMException && error.name === "TypeMismatchError") {
      return true;
    }

    throw error;
  }
}

export async function archivePost(
  post: Post,
  directoryHandle: FileSystemDirectoryHandle,
): Promise<string> {
  const datePrefix = getDatePrefix(new Date());
  const directoryName = `${datePrefix}-${post.slug}`;

  // Writing into an existing folder would overwrite the earlier post's files.
  if (await entryExists(directoryHandle, directoryName)) {
    throw new ArchiveDirectoryTakenError(directoryName);
  }

  const postDirectoryHandle = await directoryHandle.getDirectoryHandle(directoryName, {
    create: true,
  });

  const markdown = generateMarkdown(post);
  const markdownFileHandle = await postDirectoryHandle.getFileHandle("post.md", {
    create: true,
  });
  const writable = await markdownFileHandle.createWritable();
  await writable.write(markdown);
  await writable.close();

  for (const file of post.attachments) {
    const fileHandle = await postDirectoryHandle.getFileHandle(file.name, {
      create: true,
    });
    const writable = await fileHandle.createWritable();
    await writable.write(file);
    await writable.close();
  }

  return directoryName;
}
