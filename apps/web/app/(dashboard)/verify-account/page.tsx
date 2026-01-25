import { Navbar } from "@/components/shared/navbar";
import { UploadFile } from "@/modules/profile/views/upload-file";
import { auth } from "@clerk/nextjs/server";
import { api } from "@workspace/backend/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import { redirect } from "next/navigation";

export default async function VerifyAccount() {
  const result = await auth();
  const token = (await result.getToken({ template: "convex" })) ?? undefined;
  const status = await fetchQuery(
    api.functions.users.checkVerificationStatus,
    {},
    { token },
  );
  if (status?.isAuthorized || status?.verificationStatus === "in-review") {
    redirect("/");
  }
  return (
    <div className="w-full">
      <Navbar />
      <div className="p-4">
        <UploadFile />
      </div>
    </div>
  );
}
