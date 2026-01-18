import { AuthGuard } from "@/modules/auth/components/auth-guard";
import { OnboardingForm } from "@/modules/profile/components/onboarding-form";
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
      <div className="p-4 min-h-svh h-full w-full flex flex-col gap-y-2 justify-center items-center max-w-md mx-auto">
        <h2 className="text-neutral-700 font-medium text-lg md:text-xl">
          Complete Your Profile
        </h2>
        <p className="text-sm md:text-base font-normal text-neutral-500">
          Please fill in all the details correctly
        </p>
        <OnboardingForm />
      </div>
    </AuthGuard>
  );
}
