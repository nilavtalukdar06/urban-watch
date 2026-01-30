"use client";

import { api } from "@workspace/backend/convex/_generated/api";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { OrganizationTrigger } from "../components/organization-card";

export function GridView({
  preloadedOrganizations,
}: {
  preloadedOrganizations: Preloaded<
    typeof api.functions.organizations.getOrganizations
  >;
}) {
  const organizations = usePreloadedQuery(preloadedOrganizations);
  if (organizations === undefined) {
    return (
      <div className="my-4 w-full">
        <p className="text-muted-forground font-light animate-pulse">
          Loading...
        </p>
      </div>
    );
  }
  if (organizations.length === 0) {
    return (
      <div className="my-4 w-full">
        <p className="text-red-500 font-light">
          No organizations are currently accepting donations
        </p>
      </div>
    );
  }
  return (
    <div className="my-4 w-full">
      <div className="w-full grid grid-cols-2 max-[500px]:grid-cols-1 place-items-center gap-4">
        {organizations.map((item) => (
          <OrganizationTrigger key={item._id} {...item} />
        ))}
      </div>
    </div>
  );
}
