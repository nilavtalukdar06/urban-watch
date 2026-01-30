"use client";

import { api } from "@workspace/backend/convex/_generated/api";
import { Preloaded, usePreloadedQuery } from "convex/react";

export function GridView({
  preloadedOrganizations,
}: {
  preloadedOrganizations: Preloaded<
    typeof api.functions.organizations.getOrganizations
  >;
}) {
  const organizations = usePreloadedQuery(preloadedOrganizations);
  return (
    <div className="my-4">
      <p className="text-muted-foreground font-light">Grid View</p>
    </div>
  );
}
