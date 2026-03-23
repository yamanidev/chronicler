import { useEffect, useState } from "preact/hooks";
import { CurrentStep } from "./components/CurrentStep";
import { DirectoryIndicator } from "./components/DirectoryIndicator";
import { SocialLinks } from "./components/SocialLinks";
import type { Platform, Post, PostFormData } from "./types";
import { usePersistedDirectoryHandle } from "./hooks/usePersistedDirectoryHandle";
import { archivePost, isFileSystemAccessSupported, slugify } from "./utils";

export function App() {
  const [step, setStep] = useState<"welcome" | "form" | "links" | "success">("welcome");
  const { directoryHandle, isLoading, grantedOnLoad, persistHandle } =
    usePersistedDirectoryHandle();
  const [postData, setPostData] = useState<PostFormData | null>(null);
  const [archivedDirectory, setArchivedDirectory] = useState<string>("");

  useEffect(() => {
    if (grantedOnLoad) setStep("form");
  }, [grantedOnLoad]);

  const handleWelcomeContinue = async (handle?: FileSystemDirectoryHandle) => {
    await persistHandle(handle);
    setStep("form");
  };

  const handlePublish = (data: PostFormData) => {
    if (!isFileSystemAccessSupported) return;

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

    if (directoryHandle) {
      try {
        const directoryName = await archivePost(post, directoryHandle);
        setArchivedDirectory(directoryName);
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
    setArchivedDirectory("");
    setStep("form");
  };

  const handleChangeDirectory = async () => {
    try {
      const handle = await window.showDirectoryPicker();
      await persistHandle(handle);
    } catch {
      // `showDirectoryPicker` throws on abort
      // User cancelled — keep existing directory
    }
  };

  return (
    <>
      <CurrentStep
        step={step}
        isLoading={isLoading}
        grantedOnLoad={grantedOnLoad}
        directoryHandle={directoryHandle}
        postData={postData}
        archivedDirectory={archivedDirectory}
        onWelcomeContinue={handleWelcomeContinue}
        onPublish={handlePublish}
        onLinksSubmit={handleLinksSubmit}
        onCreateAnother={handleCreateAnother}
      />
      {directoryHandle && step !== "welcome" && (
        <DirectoryIndicator
          directoryHandle={directoryHandle}
          onChangeDirectory={handleChangeDirectory}
        />
      )}
      <SocialLinks />
    </>
  );
}
