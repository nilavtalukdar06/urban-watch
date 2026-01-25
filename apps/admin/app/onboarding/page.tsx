import { OnboardingForm } from "@/modules/profile/components/onboarding-form";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function OnboardingPage() {
  const { orgId } = await auth();
  if (!orgId) {
    redirect("/sign-in");
  }
  const client = await clerkClient();
  const organization = await client.organizations.getOrganization({
    organizationId: orgId,
  });
  if (organization.publicMetadata?.hasProfile) {
    redirect("/");
  }
  return (
    <div className="p-4 min-h-svh w-full h-full gap-2 flex flex-col justify-center items-center">
      <div className="max-w-sm mx-auto w-full flex flex-col gap-4">
        <div className="w-full text-center gap-2">
          <h3 className="text-lg text-neutral-700">
            Complete Organization Profile
          </h3>
          <p className="text-sm font-light text-muted-foreground">
            Please fill in all the details correctly to continue
          </p>
        </div>
        <OnboardingForm />
      </div>
    </div>
  );
}
