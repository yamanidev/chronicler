import { useState, useEffect } from "preact/hooks";
import type { Platform, PostFormData } from "../types";
import { slugify, copyToClipboard } from "../utils";

interface PostFormProps {
  onPublish: (data: PostFormData) => void;
}

export function PostForm({ onPublish }: PostFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [categoryInput, setCategoryInput] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [copied, setCopied] = useState<"content" | "attachments" | null>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const slug = slugify(title);

  useEffect(() => {
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    const urls = attachments.map((file) =>
      file.type.startsWith("image/") ? URL.createObjectURL(file) : "",
    );
    setPreviewUrls(urls);

    return () => {
      urls.forEach((url) => url && URL.revokeObjectURL(url));
    };
  }, [attachments]);

  const handleCopyContent = async () => {
    try {
      await copyToClipboard(content);
      setCopied("content");
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      alert("Failed to copy content");
    }
  };

  const handleCopyAttachments = async () => {
    if (attachments.length === 0) return;

    try {
      const imageFiles = attachments.filter((f) => f.type.startsWith("image/"));

      if (imageFiles.length > 0) {
        const clipboardItems = await Promise.all(
          imageFiles.map(async (file) => {
            const blob = new Blob([await file.arrayBuffer()], { type: file.type });
            return new ClipboardItem({ [file.type]: blob });
          }),
        );

        await navigator.clipboard.write(clipboardItems);
      } else {
        const attachmentList = attachments.map((f) => f.name).join("\n");
        await copyToClipboard(attachmentList);
      }

      setCopied("attachments");
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      console.error("Failed to copy attachments:", error);
      alert("Failed to copy attachments");
    }
  };

  const handleAddCategory = () => {
    const trimmed = categoryInput.trim();
    if (trimmed && !categories.includes(trimmed)) {
      setCategories([...categories, trimmed]);
      setCategoryInput("");
    }
  };

  const handleRemoveCategory = (category: string) => {
    setCategories(categories.filter((c) => c !== category));
  };

  const handleFileChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.files) {
      setAttachments([...attachments, ...Array.from(target.files)]);
    }
  };

  const handlePaste = async (e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    const imageFiles: File[] = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) {
          const timestamp = Date.now();
          const newFile = new File([file], `pasted-image-${timestamp}.${file.type.split("/")[1]}`, {
            type: file.type,
          });
          imageFiles.push(newFile);
        }
      }
    }

    if (imageFiles.length > 0) {
      setAttachments([...attachments, ...imageFiles]);
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const togglePlatform = (platform: Platform) => {
    if (platforms.includes(platform)) {
      setPlatforms(platforms.filter((p) => p !== platform));
    } else {
      setPlatforms([...platforms, platform]);
    }
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please provide a title");
      return;
    }

    if (!content.trim()) {
      alert("Please provide content");
      return;
    }

    if (platforms.length === 0) {
      alert("Please select at least one platform");
      return;
    }

    onPublish({
      title,
      content,
      attachments,
      categories,
      platforms,
    });
  };

  return (
    <div class="bg-cream min-h-screen p-8">
      <div class="mx-auto max-w-3xl">
        <div class="mb-6 text-center">
          <h1 class="font-bitter text-charcoal text-4xl font-bold">Create Post</h1>
          <p class="text-taupe mt-2">Fill in the details below and mark as published when ready</p>
        </div>

        <form onSubmit={handleSubmit} class="space-y-6">
          <div class="rounded-lg bg-white p-6 shadow-lg">
            <div class="space-y-6">
              <div>
                <label class="text-charcoal mb-2 block text-sm font-semibold">Title</label>
                <input
                  type="text"
                  placeholder="Enter post title"
                  class="border-taupe-light text-charcoal focus:border-sage focus:ring-mint-light w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none"
                  value={title}
                  onInput={(e) => setTitle((e.target as HTMLInputElement).value)}
                />
                {title && <p class="text-sage mt-1 text-sm">Slug: {slug}</p>}
              </div>

              <div>
                <div class="mb-2 flex items-center justify-between">
                  <label class="text-charcoal text-sm font-semibold">Content</label>
                  <button
                    type="button"
                    class="text-taupe hover:bg-cream rounded px-3 py-1 text-sm font-medium disabled:opacity-50"
                    onClick={handleCopyContent}
                    disabled={!content}>
                    {copied === "content" ? "Copied!" : "Copy"}
                  </button>
                </div>
                <textarea
                  placeholder="Write your post content here..."
                  class="border-taupe-light text-charcoal focus:border-sage focus:ring-mint-light h-40 w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none"
                  value={content}
                  onInput={(e) => setContent((e.target as HTMLTextAreaElement).value)}></textarea>
              </div>

              <div>
                <div class="mb-2 flex items-center justify-between">
                  <label class="text-charcoal text-sm font-semibold">Attachments</label>
                  {attachments.length > 0 && (
                    <button
                      type="button"
                      class="text-taupe hover:bg-cream rounded px-3 py-1 text-sm font-medium"
                      onClick={handleCopyAttachments}>
                      {copied === "attachments" ? "Copied!" : "Copy"}
                    </button>
                  )}
                </div>
                <div
                  class="border-taupe-light bg-cream hover:border-sage hover:bg-mint-light/20 min-h-32 w-full rounded-lg border-2 border-dashed p-4 text-center transition"
                  onPaste={handlePaste}>
                  <div class="flex flex-col items-center justify-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="text-taupe h-8 w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p class="text-taupe text-sm">
                      Paste images here or{" "}
                      <label class="text-sage cursor-pointer hover:underline">
                        browse files
                        <input
                          type="file"
                          class="hidden"
                          multiple
                          accept="image/*,video/*"
                          onChange={handleFileChange}
                        />
                      </label>
                    </p>
                  </div>
                </div>
                {attachments.length > 0 && (
                  <div class="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
                    {attachments.map((file, index) => (
                      <div key={`${file.name}-${index}`} class="group relative">
                        <div class="border-cream-dark bg-cream aspect-square overflow-hidden rounded-lg border">
                          {file.type.startsWith("image/") && previewUrls[index] ? (
                            <img
                              src={previewUrls[index]}
                              alt={file.name}
                              class="h-full w-full object-cover"
                            />
                          ) : (
                            <div class="flex h-full w-full items-center justify-center">
                              <div class="text-center">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  class="text-taupe mx-auto h-8 w-8"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor">
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                                  />
                                </svg>
                                <p class="text-taupe-dark mt-1 text-xs">{file.name}</p>
                              </div>
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          class="bg-taupe-dark hover:bg-charcoal absolute top-1 right-1 rounded-full p-1 text-white opacity-0 transition group-hover:opacity-100"
                          onClick={() => handleRemoveAttachment(index)}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                        <p class="text-taupe mt-1 truncate text-xs">{file.name}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label class="text-charcoal mb-2 block text-sm font-semibold">Categories</label>
                <div class="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add a category"
                    class="border-taupe-light text-charcoal focus:border-sage focus:ring-mint-light flex-1 rounded-lg rounded-r-none border border-r-0 px-4 py-2 focus:ring-2 focus:outline-none"
                    value={categoryInput}
                    onInput={(e) => setCategoryInput((e.target as HTMLInputElement).value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddCategory();
                      }
                    }}
                  />
                  <button
                    type="button"
                    class="bg-sage hover:bg-sage-dark rounded-lg rounded-l-none px-6 py-2 font-semibold text-white"
                    onClick={handleAddCategory}>
                    Add
                  </button>
                </div>
                {categories.length > 0 && (
                  <div class="mt-2 flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <span
                        key={category}
                        class="bg-mint-light text-charcoal inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium">
                        {category}
                        <button
                          type="button"
                          class="hover:bg-mint rounded-full"
                          onClick={() => handleRemoveCategory(category)}>
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label class="text-charcoal mb-2 block text-sm font-semibold">
                  Platforms to Publish
                </label>
                <div class="flex flex-wrap gap-4">
                  {(["facebook", "linkedin", "twitter"] as Platform[]).map((platform) => (
                    <label key={platform} class="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        class="border-taupe-light text-sage focus:ring-mint h-4 w-4 rounded focus:ring-2"
                        checked={platforms.includes(platform)}
                        onChange={() => togglePlatform(platform)}
                      />
                      <span class="text-charcoal capitalize">{platform}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-2">
            <button
              type="submit"
              class="bg-sage hover:bg-sage-dark rounded-lg px-6 py-3 font-semibold text-white">
              Mark as Published
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
