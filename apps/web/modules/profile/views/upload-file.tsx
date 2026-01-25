"use client";

import { FileUploaderMinimal } from "@uploadcare/react-uploader/next";
import "@uploadcare/react-uploader/core.css";
import { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { toast } from "sonner";
import { verifyAccount } from "../functions/verify-account";
import { cn } from "@workspace/ui/lib/utils";
import { Spinner } from "@workspace/ui/components/spinner";
import { useRouter } from "next/navigation";

export function UploadFile() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>("");

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      await verifyAccount(imageUrl);
      toast.success("Request has been sent");
      router.replace("/");
    } catch (error) {
      console.error(error);
      toast.error("Failed to send verification request");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="max-w-xs w-full mx-auto my-24">
      <div className="text-muted-foreground font-light text-center flex flex-col gap-y-4 justify-center items-center">
        <h3 className="text-neutral-700">Upload your Identity</h3>
        <FileUploaderMinimal
          className={cn(
            "w-full",
            isLoading && "pointer-events-none opacity-50",
          )}
          sourceList="local, camera"
          classNameUploader="uc-light"
          pubkey={process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY!}
          multiple={false}
          removeCopyright={true}
          onCommonUploadSuccess={(e) => {
            e.successEntries.map((item) => setImageUrl(item.cdnUrl));
          }}
        />
        <p className="text-muted-foreground font-light text-center">
          Upload a clear, well-lit photo of your full Identity Card. If it has
          two sides, merge the front and back into one image before uploading.
        </p>
        <Button
          className="rounded-lg text-sm"
          onClick={handleSubmit}
          disabled={isLoading || !imageUrl}
        >
          {isLoading ? (
            <span className="flex gap-x-2 justify-center items-center">
              <Spinner />
              <span>Requesting...</span>
            </span>
          ) : (
            "Request Verification"
          )}
        </Button>
      </div>
    </div>
  );
}
