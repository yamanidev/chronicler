import { useState } from "preact/hooks";
import { SUPPORTED_PLATFORMS } from "../constants";
import type { Platform } from "../types";

interface LinkCollectionFormProps {
  platforms: Platform[];
  onSubmit: (links: Record<Platform, string>) => void;
}

export function LinkCollectionForm({ platforms, onSubmit }: LinkCollectionFormProps) {
  const [links, setLinks] = useState<Record<string, string>>(
    Object.fromEntries(platforms.map((p) => [p, ""])),
  );

  const handleSubmit = (e: Event) => {
    e.preventDefault();

    for (const platform of platforms) {
      if (!links[platform]?.trim()) {
        alert(`Please provide a link for ${SUPPORTED_PLATFORMS[platform]}`);
        return;
      }
    }

    onSubmit(links as Record<Platform, string>);
  };

  const updateLink = (platform: Platform, value: string) => {
    setLinks({ ...links, [platform]: value });
  };

  return (
    <div class="bg-cream flex min-h-screen items-center justify-center p-8">
      <div class="w-full max-w-lg rounded-lg bg-white p-8 shadow-lg">
        <h2 class="font-bitter text-charcoal mb-2 text-2xl font-bold">Provide Platform Links</h2>
        <p class="text-taupe mb-6">Enter the URLs for your published posts on each platform</p>

        <div class="border-cream-dark my-6 border-t"></div>

        <form onSubmit={handleSubmit} class="space-y-4">
          {platforms.map((platform) => (
            <div key={platform}>
              <label class="text-charcoal mb-2 block text-sm font-semibold">
                {SUPPORTED_PLATFORMS[platform]}
              </label>
              <input
                type="url"
                placeholder={`https://${platform}.com/...`}
                class="border-taupe-light text-charcoal focus:border-sage focus:ring-mint-light w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none"
                value={links[platform]}
                onInput={(e) => updateLink(platform, (e.target as HTMLInputElement).value)}
                required
              />
            </div>
          ))}

          <div class="flex justify-end pt-4">
            <button
              type="submit"
              class="bg-sage hover:bg-sage-dark rounded-lg px-6 py-3 font-semibold text-white">
              Archive Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
