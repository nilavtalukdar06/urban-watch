import Image from "next/image";

export default function Loading() {
  return (
    <div className="min-h-svh w-full h-full flex justify-center items-center">
      <Image
        src="/logo.svg"
        height={36}
        width={160}
        alt="logo"
        className="animate-pulse"
      />
    </div>
  );
}
