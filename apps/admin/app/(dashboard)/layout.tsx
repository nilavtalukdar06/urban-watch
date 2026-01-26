import { AuthGuard } from "@/modules/auth/components/auth-guard";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  SidebarProvider,
  SidebarTrigger,
} from "@workspace/ui/components/sidebar";
import { AppSidebar } from "@/components/shared/app-sidebar";
import { cookies } from "next/headers";

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
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
  return (
    <AuthGuard>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <main className="flex-1 min-w-0">
          <div className="p-2">
            <SidebarTrigger />
          </div>
          {children}
        </main>
      </SidebarProvider>
    </AuthGuard>
  );
}
