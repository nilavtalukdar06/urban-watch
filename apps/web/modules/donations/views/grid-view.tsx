"use client";

import { api } from "@workspace/backend/convex/_generated/api";
import { Preloaded } from "convex/react";
import { useEffect } from "react";

export function GridView({
  preloadedOrganizations,
}: {
  preloadedOrganizations: Preloaded<
    typeof api.functions.organizations.getOrganizations
  >;
}) {
  useEffect(() => {
    if (preloadedOrganizations) console.log(preloadedOrganizations);
  }, [preloadedOrganizations]);
  return (
    <div className="my-4">
      <p className="text-muted-foreground font-light">Grid View</p>
    </div>
  );
}
