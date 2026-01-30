"use client";

import { DeleteMessages } from "@/modules/chatbot/components/delete-messages";
import { Verification } from "@/modules/profile/components/verification";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@workspace/ui/components/button";
import { CoinsIcon, SendIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();
  return (
    <div className="w-full">
      {pathname !== "/verify-account" && (
        <div className="px-4">
          <Verification />
        </div>
      )}
      <header className="w-full p-4 flex justify-between items-center">
        <Link href="/">
          <Image src="/logo.svg" height={36} width={160} alt="logo" />
        </Link>
        <nav className="flex justify-end gap-x-3 items-center">
          <Button
            variant="outline"
            size="icon-sm"
            asChild
            className="rounded-none shadow-none bg-sidebar font-normal"
          >
            <Link href="/chat">
              <SendIcon className="text-muted-foreground" />
            </Link>
          </Button>
          {pathname === "/chatbot" && <DeleteMessages />}
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Link
                label="Donate Organizations"
                href="/donate"
                labelIcon={<CoinsIcon size={14} />}
              />
            </UserButton.MenuItems>
          </UserButton>
        </nav>
      </header>
    </div>
  );
}
