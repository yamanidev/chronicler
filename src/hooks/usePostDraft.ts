import { useEffect, useRef, useState } from "preact/hooks";
import { clearDraft, loadDraft, saveDraft } from "../storage";
import type { PostFormData } from "../types";

export type SaveStatus = "restoring" | "idle" | "saving" | "saved";

export function usePostDraft(
  formData: PostFormData,
  isDirty: boolean,
  onRestore: (data: PostFormData) => void,
): { saveStatus: SaveStatus } {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("restoring");
  const { title, content, attachments, categories, links } = formData;

  const onRestoreRef = useRef(onRestore);
  useEffect(() => {
    onRestoreRef.current = onRestore;
  });

  const isFromIDBRef = useRef(false);

  useEffect(() => {
    loadDraft().then((draft) => {
      if (draft) {
        isFromIDBRef.current = true;
        onRestoreRef.current(draft.formData);
      }
      setSaveStatus("idle");
    });
  }, []);

  useEffect(() => {
    if (!isDirty) return;

    if (isFromIDBRef.current) {
      isFromIDBRef.current = false;

      return;
    }
    setSaveStatus("saving");
    const timer = setTimeout(async () => {
      await saveDraft({ title, content, attachments, categories, links });
      setSaveStatus("saved");
    }, 500);

    return () => clearTimeout(timer);
  }, [title, content, attachments, categories, links]);

  useEffect(() => {
    if (saveStatus === "restoring" || isDirty || isFromIDBRef.current) return;
    clearDraft().catch(console.error);
  }, [isDirty, saveStatus]);

  useEffect(() => {
    if (saveStatus !== "saved") return;

    const timer = setTimeout(() => setSaveStatus("idle"), 2000);

    return () => clearTimeout(timer);
  }, [saveStatus]);

  return { saveStatus };
}
