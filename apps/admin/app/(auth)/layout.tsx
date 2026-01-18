import { AuthLayout } from "@/modules/auth/layouts/auth-layout";

interface Props {
  children: Readonly<React.ReactNode>;
}

export default function Layout({ children }: Props) {
  return <AuthLayout>{children}</AuthLayout>;
}
