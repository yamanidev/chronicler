import { del, get, set } from "idb-keyval";

const HANDLE_KEY = "archive-folder-handle";

export async function saveHandle(handle: FileSystemDirectoryHandle): Promise<void> {
  await set(HANDLE_KEY, handle);
}

export async function loadHandle(): Promise<FileSystemDirectoryHandle | undefined> {
  return get<FileSystemDirectoryHandle>(HANDLE_KEY);
}

export async function clearHandle(): Promise<void> {
  await del(HANDLE_KEY);
}
