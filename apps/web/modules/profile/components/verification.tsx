"use client";

import { api } from "@workspace/backend/convex/_generated/api";
import { useQuery } from "convex/react";
import Link from "next/link";

export function Verification() {
  const result = useQuery(api.functions.users.checkVerificationStatus);
  if (result === undefined) {
    return null;
  }
  if (result && result.isAuthorized) {
    return null;
  }
  if (result && result?.verificationStatus === "in-review") {
    return (
      <div className="p-1 bg-yellow-50">
        <p className="text-sm font-light text-yellow-500 text-center">
          You are account is currently in review, we will notify you once done
        </p>
      </div>
    );
  }
  return (
    <div className="p-1 bg-red-50">
      <p className="text-sm font-light text-red-500 text-center">
        You have not verified your account yet, please click here to{" "}
        <Link
          className="text-red-700 underline cursor-pointer"
          href="/verify-account"
        >
          verify
        </Link>
      </p>
    </div>
  );
}
