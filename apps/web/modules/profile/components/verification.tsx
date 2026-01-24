"use client";

import { api } from "@workspace/backend/convex/_generated/api";
import { useQuery } from "convex/react";

export function Verification() {
  const result = useQuery(api.functions.users.checkVerificationStatus);
  if (result === undefined) {
    return null;
  }
  if (result && result.isAuthorized) {
    return null;
  }
  return (
    <div className="p-1 bg-red-50">
      <p className="text-sm font-light text-red-500 text-center">
        You have not verified your account yet, please click here to{" "}
        <span className="text-red-700 underline cursor-pointer">verify</span>
      </p>
    </div>
  );
}
