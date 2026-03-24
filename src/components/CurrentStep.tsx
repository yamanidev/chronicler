import { PostForm } from "./PostForm";
import { SuccessStep } from "./SuccessStep";
import { WelcomeStep } from "./WelcomeStep";
import type { PostFormData } from "../types";

export function CurrentStep({
  step,
  isLoading,
  grantedOnLoad,
  directoryHandle,
  archivedDirectory,
  onWelcomeContinue,
  onPublish,
  onCreateAnother,
}: {
  step: "welcome" | "form" | "success";
  isLoading: boolean;
  grantedOnLoad: boolean;
  directoryHandle: FileSystemDirectoryHandle | null | undefined;
  archivedDirectory: string;
  onWelcomeContinue: (handle?: FileSystemDirectoryHandle) => void;
  onPublish: (data: PostFormData) => void;
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

  if (step === "success") {
    return <SuccessStep directoryName={archivedDirectory} onCreateAnother={onCreateAnother} />;
  }

  return null;
}
