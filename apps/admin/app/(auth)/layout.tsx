interface Props {
  children: Readonly<React.ReactNode>;
}

export default function AuthLayout({ children }: Props) {
  return (
    <div className="min-h-svh h-full w-full flex justify-center items-center">
      {children}
    </div>
  );
}
