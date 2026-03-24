import type { SaveStatus } from "../hooks/usePostDraft";

interface DraftStatusIndicatorProps {
  saveStatus: SaveStatus;
}

export function DraftStatusIndicator({ saveStatus }: DraftStatusIndicatorProps) {
  let text: string | null = null;
  if (saveStatus === "restoring") text = "Loading draft...";
  else if (saveStatus === "saving") text = "Saving...";
  else if (saveStatus === "saved") text = "Draft saved";

  return (
    <div
      class={`absolute top-3 right-3 flex items-center gap-1.5 rounded-full px-3 py-1 text-xs transition-all duration-300 ${text ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0"}`}>
      {saveStatus === "saving" && (
        <svg
          class="text-taupe h-3 w-3 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24">
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      <span class="text-taupe">{text}</span>
    </div>
  );
}
