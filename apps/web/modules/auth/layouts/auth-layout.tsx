interface Props {
  children: Readonly<React.ReactNode>;
}

export function AuthLayout({ children }: Props) {
  return (
    <div className="min-h-svh w-full flex flex-col justify-center items-center h-full">
      {children}
    </div>
  );
}
