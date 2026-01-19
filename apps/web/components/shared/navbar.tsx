"use client";

import { UserButton } from "@clerk/nextjs";
import { MessageSquareCodeIcon, TriangleAlertIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function Navbar() {
  return (
    <header className="w-full p-4 flex justify-between items-center">
      <Link href="/">
        <Image src="/logo.svg" height={36} width={160} alt="logo" />
      </Link>
      <UserButton>
        <UserButton.MenuItems>
          <UserButton.Link
            label="Chat with AI"
            href="/chatbot"
            labelIcon={<MessageSquareCodeIcon size={16} />}
          />
          <UserButton.Link
            label="My Reports"
            href="/reports"
            labelIcon={<TriangleAlertIcon size={16} />}
          />
        </UserButton.MenuItems>
      </UserButton>
    </header>
  );
}
