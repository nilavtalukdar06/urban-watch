"use client";

import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@workspace/ui/components/sidebar";
import {
  ClipboardCheckIcon,
  HashIcon,
  InboxIcon,
  UserRoundCheckIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const taskItems = [
  {
    label: "All Tasks",
    path: "/",
    icon: ClipboardCheckIcon,
  },
  {
    label: "My Tasks",
    path: "/my-tasks",
    icon: UserRoundCheckIcon,
  },
] as const;

const reportItems = [
  {
    label: "General",
    path: "/reports",
    icon: HashIcon,
  },
  {
    label: "My Reports",
    path: "/my-reports",
    icon: InboxIcon,
  },
] as const;

const settingsItems = [
  {
    label: "Manage Users",
    path: "/users",
    icon: "clerk.svg",
  },
  {
    label: "Payments",
    path: "/payments",
    icon: "stripe.svg",
  },
] as const;

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <OrganizationSwitcher
              appearance={{
                elements: {
                  organizationSwitcherTriggerIcon: "hidden!",
                  organizationSwitcherTrigger: "py-2!",
                },
              }}
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Manage Tasks</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {taskItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild>
                    <Link href={item.path}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Manage Reports</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {reportItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild>
                    <Link href={item.path}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>All Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild>
                    <Link href={item.path}>
                      <Image
                        src={`/icons/${item.icon}`}
                        height={16}
                        width={16}
                        alt="logos"
                      />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <UserButton
              showName={true}
              appearance={{
                elements: {
                  userButtonBox: "flex-row-reverse! p-2!",
                  avatarBox: "size-5!",
                  userButtonOuterIdentifier: "p-0!",
                },
              }}
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
