import { Navbar } from "@/components/shared/navbar";
import { UploadFile } from "@/modules/profile/views/upload-file";

export default function VerifyAccount() {
  return (
    <div className="w-full">
      <Navbar />
      <div className="p-4">
        <UploadFile />
      </div>
    </div>
  );
}
