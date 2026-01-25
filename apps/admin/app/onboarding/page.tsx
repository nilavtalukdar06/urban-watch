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
    <div className="p-4">
      <p className="text-muted-foreground font-light">Onboarding Page</p>
    </div>
  );
}
