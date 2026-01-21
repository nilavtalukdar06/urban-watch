"use client";

import { Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "@workspace/backend/convex/_generated/api";
import { useEffect } from "react";

export function Leaderboard(props: {
  preloadedUsers: Preloaded<typeof api.functions.users.getUsers>;
}) {
  const users = usePreloadedQuery(props.preloadedUsers);
  useEffect(() => {
    console.log(users);
  }, [users]);
  return (
    <div className="my-4">
      <p className="text-muted-foreground"></p>
    </div>
  );
}
