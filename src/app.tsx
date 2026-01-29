import { useState } from "preact/hooks";
import { LinkCollectionForm } from "./components/LinkCollectionForm";
import { PostForm } from "./components/PostForm";
import { SuccessStep } from "./components/SuccessStep";
import { WelcomeStep } from "./components/WelcomeStep";
import type { Platform, Post, PostFormData } from "./types";
import { archivePost, slugify } from "./utils";

export function App() {
  const [step, setStep] = useState<"welcome" | "form" | "links" | "success">("welcome");
  // undefined (default): not selected
  // null: user skipped the selection of an archival directory
  // FileSystemDirectoryHandle: the user selected a directory successfully
  const [folderHandle, setFolderHandle] = useState<FileSystemDirectoryHandle | null>();
  const [postData, setPostData] = useState<PostFormData | null>(null);
  const [archivedFolder, setArchivedFolder] = useState<string>("");

  const handleWelcomeContinue = (handle?: FileSystemDirectoryHandle) => {
    setFolderHandle(handle);
    setStep("form");
  };

  const handlePublish = (data: PostFormData) => {
    setPostData(data);
    setStep("links");
  };

  const handleLinksSubmit = async (links: Record<Platform, string>) => {
    if (!postData) return;

    const post: Post = {
      ...postData,
      slug: slugify(postData.title),
      links,
    };

    if (folderHandle) {
      try {
        const folderName = await archivePost(post, folderHandle);
        setArchivedFolder(folderName);
        setStep("success");
      } catch (error) {
        console.error("Failed to archive post:", error);
        alert("Failed to archive post. Please try again.");
      }
    } else {
      alert("No archive folder selected. Post was not saved.");
      setStep("form");
    }
  };

  const handleCreateAnother = () => {
    setPostData(null);
    setArchivedFolder("");
    setStep("form");
  };

  return (
    <>
      {step === "welcome" && <WelcomeStep onContinue={handleWelcomeContinue} />}
      {step === "form" && <PostForm onPublish={handlePublish} />}
      {step === "links" && postData && (
        <LinkCollectionForm platforms={postData.platforms} onSubmit={handleLinksSubmit} />
      )}
      {step === "success" && (
        <SuccessStep folderName={archivedFolder} onCreateAnother={handleCreateAnother} />
      )}
    </>
  );
}
