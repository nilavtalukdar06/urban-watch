import { Navbar } from "@/components/shared/navbar";
import { AuthGuard } from "@/modules/auth/components/auth-guard";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface Props {
  children: React.ReactNode;
}

export default async function Layout({ children }: Props) {
  const user = await currentUser();
  if (user) {
    const hasOnboarded = user.publicMetadata?.hasOnboarded;
    if (!hasOnboarded) {
      redirect("/onboarding");
    }
  }
  return (
    <AuthGuard>
      <main className="max-w-2xl mx-auto w-full">
        <Navbar />
        {children}
      </main>
    </AuthGuard>
  );
}
