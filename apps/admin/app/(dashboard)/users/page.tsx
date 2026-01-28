import { TableView } from "@/modules/users/table-view";
import { auth } from "@clerk/nextjs/server";
import { api } from "@workspace/backend/convex/_generated/api";
import { preloadQuery } from "convex/nextjs";

export default async function UsersPage() {
  const user = await auth();
  const token = (await user.getToken({ template: "convex" })) ?? undefined;
  const preloadedUsers = await preloadQuery(
    api.functions.users.getUsers,
    {},
    { token },
  );
  return (
    <div className="px-4 pb-4">
      <p className="text-lg text-neutral-600 font-light">All Users</p>
      <p className="text-sm text-muted-foreground font-light">
        Manage all of the user accounts here
      </p>
      <TableView preloadedUsers={preloadedUsers} />
    </div>
  );
}
