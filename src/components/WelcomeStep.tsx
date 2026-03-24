import { isFileSystemAccessSupported } from "../utils";
import { AppCredit } from "./AppCredit";

export function WelcomeStep({
  storedHandle,
  onContinue,
}: {
  storedHandle?: FileSystemDirectoryHandle;
  onContinue: (folderHandle?: FileSystemDirectoryHandle) => void;
}) {
  if (!isFileSystemAccessSupported) {
    return (
      <div class="bg-cream flex min-h-screen items-center justify-center p-8">
        <div class="w-full max-w-lg rounded-lg bg-white p-8 shadow-lg">
          <h2 class="font-bitter text-charcoal mb-2 text-3xl font-bold">Chronicler</h2>
          <p class="text-charcoal mb-4 text-lg font-medium">Write once, copy to platforms.</p>
          <p class="text-taupe mb-4">
            A simple place to draft your social media posts and copy them to your clipboard.
          </p>
          <AppCredit />

          <div class="border-cream-dark my-6 border-t"></div>

          <div class="space-y-4">
            <div class="bg-mint-light/30 rounded-lg p-4">
              <div class="flex gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  class="stroke-sage h-6 w-6 shrink-0">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="text-charcoal text-sm">
                  Your browser doesn't support the File System Access API, so local archiving is
                  unavailable. You can still create and copy content to your platforms.
                </span>
              </div>
            </div>
            <button
              class="bg-sage hover:bg-sage-dark w-full rounded-lg px-6 py-3 font-semibold text-white transition"
              onClick={() => onContinue()}>
              Get Started
            </button>
          </div>
        </div>
      </div>
    );
  }

  const selectDirectory = async () => {
    try {
      const handle = await window.showDirectoryPicker();
      onContinue(handle);
    } catch (error) {
      console.error("Directory selection cancelled or failed:", error);
    }
  };

  const restoreDirectory = async () => {
    try {
      const permission = await storedHandle!.requestPermission({ mode: "readwrite" });
      if (permission === "granted") {
        onContinue(storedHandle);
      }
    } catch (error) {
      console.error("Failed to restore directory access:", error);
    }
  };

  return (
    <div class="bg-cream flex min-h-screen items-center justify-center p-8">
      <div class="w-full max-w-lg rounded-lg bg-white p-8 shadow-lg">
        <h2 class="font-bitter text-charcoal mb-2 text-3xl font-bold">Chronicler</h2>
        <p class="text-charcoal mb-4 text-lg font-medium">
          Write once, copy to platforms, archive locally.
        </p>
        <p class="text-taupe mb-4">
          A simple place to draft your social media posts, copy them to your clipboard, and keep a
          Markdown record of everything you publish.
        </p>
        <AppCredit />

        <div class="border-cream-dark my-6 border-t"></div>

        <div class="space-y-4">
          {storedHandle ? (
            <>
              <p class="text-taupe text-sm">
                You previously archived to{" "}
                <span class="text-charcoal font-medium">"{storedHandle.name}"</span>. Grant access
                to continue using it.
              </p>
              <div class="flex flex-col gap-3">
                <button
                  class="bg-sage hover:bg-sage-dark w-full rounded-lg px-6 py-3 font-semibold text-white transition"
                  onClick={restoreDirectory}>
                  Continue with "{storedHandle.name}"
                </button>
                <button
                  class="border-taupe-light text-taupe hover:bg-cream w-full rounded-lg border px-6 py-3 font-semibold transition"
                  onClick={selectDirectory}>
                  Select a Different Folder
                </button>
                <button
                  class="border-taupe-light text-taupe hover:bg-cream w-full rounded-lg border px-6 py-3 font-semibold transition"
                  onClick={() => onContinue()}>
                  Skip (Don't Archive)
                </button>
              </div>
            </>
          ) : (
            <>
              <p class="text-taupe text-sm">
                You can optionally select a folder to archive your published posts. Posts will be
                saved as Markdown files with attachments.
              </p>
              <div class="flex flex-col gap-3">
                <button
                  class="bg-sage hover:bg-sage-dark w-full rounded-lg px-6 py-3 font-semibold text-white transition"
                  onClick={selectDirectory}>
                  Select Archive Folder
                </button>
                <button
                  class="border-taupe-light text-taupe hover:bg-cream w-full rounded-lg border px-6 py-3 font-semibold transition"
                  onClick={() => onContinue()}>
                  Skip (Don't Archive)
                </button>
              </div>
            </>
          )}
        </div>

        <div class="bg-mint-light/30 mt-6 rounded-lg p-4">
          <div class="flex gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              class="stroke-sage h-6 w-6 shrink-0">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span class="text-charcoal text-sm">
              If you skip, you can still create and copy content but it won't be saved to disk.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
