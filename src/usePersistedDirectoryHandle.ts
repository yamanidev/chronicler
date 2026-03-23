import { useEffect, useState } from "preact/hooks";
import { clearHandle, loadHandle, saveHandle } from "./storage";

export function usePersistedDirectoryHandle() {
  // undefined: not selected (default)
  // null: user explicitly skipped archiving
  // FileSystemDirectoryHandle: selected directory — either with active permissions
  //   or loaded from IDB and awaiting permission re-grant (welcome step)
  const [directoryHandle, setDirectoryHandle] = useState<FileSystemDirectoryHandle | null>();
  const [isLoading, setIsLoading] = useState(true);
  // True when IDB returned a handle that already has `granted` permission — signals app to skip
  // the welcome step
  const [grantedOnLoad, setGrantedOnLoad] = useState(false);

  useEffect(() => {
    loadHandle()
      .then(async (handle) => {
        if (!handle) return;

        const permission = await handle.queryPermission({ mode: "readwrite" });
        if (permission === "granted") {
          setDirectoryHandle(handle);
          setGrantedOnLoad(true);
        } else if (permission === "prompt") {
          setDirectoryHandle(handle);
        }
        // `denied`: fall through to normal welcome, no stored handle shown
      })
      .catch(() => {
        // IDB unavailable or handle corrupted — proceed with normal welcome
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const persistHandle = async (handle?: FileSystemDirectoryHandle) => {
    if (handle) {
      await saveHandle(handle);
    } else {
      // User chose to skip — clear any previously stored handle
      await clearHandle();
    }
    setDirectoryHandle(handle ?? null);
  };

  return { directoryHandle, isLoading, grantedOnLoad, persistHandle };
}
