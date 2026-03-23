import { LinkCollectionForm } from "./LinkCollectionForm";
import { PostForm } from "./PostForm";
import { SuccessStep } from "./SuccessStep";
import { WelcomeStep } from "./WelcomeStep";
import type { Platform, PostFormData } from "../types";

export function CurrentStep({
  step,
  isLoading,
  grantedOnLoad,
  directoryHandle,
  postData,
  archivedDirectory,
  onWelcomeContinue,
  onPublish,
  onLinksSubmit,
  onCreateAnother,
}: {
  step: "welcome" | "form" | "links" | "success";
  isLoading: boolean;
  grantedOnLoad: boolean;
  directoryHandle: FileSystemDirectoryHandle | null | undefined;
  postData: PostFormData | null;
  archivedDirectory: string;
  onWelcomeContinue: (handle?: FileSystemDirectoryHandle) => void;
  onPublish: (data: PostFormData) => void;
  onLinksSubmit: (links: Record<Platform, string>) => void;
  onCreateAnother: () => void;
}) {
  if (!isLoading && !grantedOnLoad && step === "welcome") {
    return (
      <WelcomeStep storedHandle={directoryHandle ?? undefined} onContinue={onWelcomeContinue} />
    );
  }

  if (step === "form") {
    return <PostForm onPublish={onPublish} />;
  }

  if (step === "links" && postData) {
    return <LinkCollectionForm platforms={postData.platforms} onSubmit={onLinksSubmit} />;
  }

  if (step === "success") {
    return <SuccessStep directoryName={archivedDirectory} onCreateAnother={onCreateAnother} />;
  }

  return null;
}
