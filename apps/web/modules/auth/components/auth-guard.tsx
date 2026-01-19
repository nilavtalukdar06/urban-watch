"use client";

import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import { AuthLayout } from "../layouts/auth-layout";
import { SignInView } from "../views/signin-view";
import Image from "next/image";

interface Props {
  children: React.ReactNode;
}

export function AuthGuard({ children }: Props) {
  return (
    <>
      <AuthLoading>
        <AuthLayout>
          <Image
            src="/logo.svg"
            height={36}
            width={160}
            alt="logo"
            className="animate-pulse"
          />
        </AuthLayout>
      </AuthLoading>
      <Unauthenticated>
        <AuthLayout>
          <SignInView />
        </AuthLayout>
      </Unauthenticated>
      <Authenticated>{children}</Authenticated>
    </>
  );
}
