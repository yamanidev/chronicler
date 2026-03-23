import { SUPPORTED_PLATFORMS } from "./constants";
import type { Post } from "./types";

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
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

${post.content}`;

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

export async function copyToClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
    throw new Error("Failed to copy to clipboard");
  }
}

export async function archivePost(
  post: Post,
  directoryHandle: FileSystemDirectoryHandle,
): Promise<string> {
  const datePrefix = getDatePrefix(new Date());
  const directoryName = `${datePrefix}-${post.slug}`;

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
