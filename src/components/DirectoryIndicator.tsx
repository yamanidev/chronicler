export function DirectoryIndicator({
  directoryHandle,
  onChangeDirectory,
}: {
  directoryHandle: FileSystemDirectoryHandle;
  onChangeDirectory: () => void;
}) {
  return (
    <div class="fixed top-4 right-4 flex items-center gap-2 text-sm">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        class="stroke-taupe h-4 w-4 shrink-0">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M3 7a2 2 0 012-2h4l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
        />
      </svg>
      <span class="text-charcoal font-medium">{directoryHandle.name}</span>
      <span class="text-taupe">•</span>
      <button
        class="text-sage hover:text-sage-dark cursor-pointer font-medium transition"
        onClick={onChangeDirectory}>
        Change folder
      </button>
    </div>
  );
}
