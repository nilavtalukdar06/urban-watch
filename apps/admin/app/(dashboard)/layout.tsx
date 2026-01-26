import { AuthGuard } from "@/modules/auth/components/auth-guard";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  SidebarProvider,
  SidebarTrigger,
} from "@workspace/ui/components/sidebar";
import { AppSidebar } from "@/components/shared/app-sidebar";

interface Props {
  children: React.ReactNode;
}

export default async function Layout({ children }: Props) {
  const { orgId } = await auth();
  if (!orgId) {
    redirect("/sign-in");
  }
  const client = await clerkClient();
  const organization = await client.organizations.getOrganization({
    organizationId: orgId,
  });
  if (!organization.publicMetadata?.hasProfile) {
    redirect("/onboarding");
  }
  return (
    <AuthGuard>
      <SidebarProvider>
        <AppSidebar />
        <main>
          <div className="p-2">
            <SidebarTrigger />
          </div>
          {children}
        </main>
      </SidebarProvider>
    </AuthGuard>
  );
}
