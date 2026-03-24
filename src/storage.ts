import { del, get, set } from "idb-keyval";
import type { PostFormData } from "./types";

const HANDLE_KEY = "archive-folder-handle";
const DRAFT_KEY = "post-draft";

type SavedDraft = {
  formData: PostFormData;
  savedAt: number;
};

export async function saveHandle(handle: FileSystemDirectoryHandle): Promise<void> {
  await set(HANDLE_KEY, handle);
}

export async function loadHandle(): Promise<FileSystemDirectoryHandle | undefined> {
  return get<FileSystemDirectoryHandle>(HANDLE_KEY);
}

export async function clearHandle(): Promise<void> {
  await del(HANDLE_KEY);
}

export async function saveDraft(formData: PostFormData): Promise<void> {
  await set(DRAFT_KEY, { formData, savedAt: Date.now() } satisfies SavedDraft);
}

export async function loadDraft(): Promise<SavedDraft | undefined> {
  return get<SavedDraft>(DRAFT_KEY);
}

export async function clearDraft(): Promise<void> {
  await del(DRAFT_KEY);
}
