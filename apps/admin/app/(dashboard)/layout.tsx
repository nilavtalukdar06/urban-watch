import { AuthGuard } from "@/modules/auth/components/auth-guard";

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return <AuthGuard>{children}</AuthGuard>;
}
