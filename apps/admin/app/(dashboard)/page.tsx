import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";

export default async function Home() {
  return (
    <div className="p-4 flex flex-col items-start justify-center">
      <UserButton />
      <OrganizationSwitcher />
    </div>
  );
}
