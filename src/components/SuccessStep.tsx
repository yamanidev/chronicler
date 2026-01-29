export function SuccessStep({
  folderName,
  onCreateAnother,
}: {
  folderName: string;
  onCreateAnother: () => void;
}) {
  return (
    <div class="bg-cream flex min-h-screen items-center justify-center p-8">
      <div class="w-full max-w-lg rounded-lg bg-white p-8 shadow-lg">
        <div class="flex justify-center">
          <div class="bg-mint rounded-full p-3">
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

        <h2 class="font-bitter text-charcoal mt-4 text-center text-2xl font-bold">
          Post Archived Successfully!
        </h2>

        <p class="text-taupe mt-2 text-center">Your post has been saved to the archive folder.</p>

        <div class="bg-mint-light/30 mt-6 rounded-lg p-4">
          <div class="flex gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="stroke-sage h-6 w-6 shrink-0"
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
              <div class="text-charcoal font-semibold">Saved to:</div>
              <div class="text-taupe-dark mt-1 text-sm">
                <code class="bg-mint-light rounded px-2 py-1">{folderName}/post.md</code>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6 flex justify-center">
          <button
            class="bg-sage hover:bg-sage-dark rounded-lg px-6 py-3 font-semibold text-white"
            onClick={onCreateAnother}>
            Create Another Post
          </button>
        </div>
      </div>
    </div>
  );
}
