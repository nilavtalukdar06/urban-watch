import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import { AuthLayout } from "../layouts/auth-layout";
import { SignInView } from "../views/signin-view";

interface Props {
  children: React.ReactNode;
}

export function AuthGuard({ children }: Props) {
  return (
    <>
      <AuthLoading>
        <AuthLayout>
          <p className="animate-pulse">Loading...</p>
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
