"use client";

import { FileUploaderMinimal } from "@uploadcare/react-uploader/next";
import "@uploadcare/react-uploader/core.css";
import { useState } from "react";
import { Button } from "@workspace/ui/components/button";

export function UploadFile() {
  const [imageUrl, setImageUrl] = useState<string>("");
  return (
    <div className="max-w-xs w-full mx-auto my-24">
      <div className="text-muted-foreground font-light text-center flex flex-col gap-y-4 justify-center items-center">
        <h3 className="text-neutral-700">Upload your Identity</h3>
        <FileUploaderMinimal
          className="w-full"
          sourceList="local, camera"
          classNameUploader="uc-light"
          pubkey="34afe62839288fda88ce"
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
        <Button className="rounded-lg text-sm">Request Verification</Button>
      </div>
    </div>
  );
}
