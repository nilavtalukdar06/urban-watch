import { AuthGuard } from "@/modules/auth/components/auth-guard";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Onboarding() {
  const user = await currentUser();
  if (user) {
    const hasOnboarded = user.publicMetadata?.hasOnboarded;
    if (hasOnboarded) {
      redirect("/");
    }
  }
  return (
    <AuthGuard>
      <div className="p-4">
        <p className="text-muted-foreground font-light">Onboarding</p>
      </div>
    </AuthGuard>
  );
}
