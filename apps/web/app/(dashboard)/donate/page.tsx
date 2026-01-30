import { Navbar } from "@/components/shared/navbar";
import { GridView } from "@/modules/donations/views/grid-view";
import { auth } from "@clerk/nextjs/server";
import { api } from "@workspace/backend/convex/_generated/api";
import { preloadQuery } from "convex/nextjs";
import { redirect } from "next/navigation";

export default async function DonationPage() {
  const { getToken } = await auth();
  const token = await getToken({ template: "convex" });
  if (!token) {
    redirect("/");
  }
  const preloadedOrganizations = await preloadQuery(
    api.functions.organizations.getOrganizations,
    {},
    { token },
  );
  return (
    <div className="w-full">
      <Navbar />
      <div className="w-full p-4">
        <p className="font-light text-lg text-neutral-600">
          Donate to Organizations
        </p>
        <p className="text-sm text-muted-foreground font-light">
          View all the Organizations and NGOs accepting donations
        </p>
        <GridView preloadedOrganizations={preloadedOrganizations} />
      </div>
    </div>
  );
}
