"use client";

import { api } from "@workspace/backend/convex/_generated/api";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { useEffect } from "react";

export function TableView(props: {
  preloadedUsers: Preloaded<typeof api.functions.users.getUsers>;
}) {
  const users = usePreloadedQuery(props.preloadedUsers);
  useEffect(() => {
    console.log(users);
  }, [users]);
  return (
    <div className="my-4">
      <p className="text-muted-foreground font-light">Citizens</p>
    </div>
  );
}
