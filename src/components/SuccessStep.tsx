import { AppCredit } from "./AppCredit";

export function SuccessStep({
  directoryName,
  onCreateAnother,
}: {
  directoryName: string;
  onCreateAnother: () => void;
}) {
  return (
    <div class="bg-paper flex min-h-screen items-center justify-center p-8">
      <div class="w-full max-w-lg rounded-lg bg-white p-8 shadow-lg">
        <div class="flex justify-center">
          <div class="bg-note rounded-full p-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-12 w-12 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <div class="mt-4 flex items-center justify-center gap-3">
          <img src="/logo-color.svg" alt="" class="h-12 w-12" />
          <h2 class="font-bitter text-ink text-2xl font-bold">Post Archived Successfully!</h2>
        </div>

        <p class="text-ash mt-2 text-center">Your post has been saved to the archive folder.</p>
        <AppCredit class="justify-center" />

        <div class="bg-note-light mt-6 rounded-lg p-4">
          <div class="flex gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="stroke-spine h-6 w-6 shrink-0"
              fill="none"
              viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div class="flex-1">
              <div class="text-ink font-semibold">Saved to:</div>
              <div class="text-ash-dark mt-1 text-sm">
                <code class="bg-note-light rounded px-2 py-1">{directoryName}/post.md</code>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6 flex justify-center">
          <button
            class="bg-spine hover:bg-spine-dark rounded-lg px-6 py-3 font-semibold text-white"
            onClick={onCreateAnother}>
            Create Another Post
          </button>
        </div>
      </div>
    </div>
  );
}
