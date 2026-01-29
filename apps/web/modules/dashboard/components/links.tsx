import { Button } from "@workspace/ui/components/button";
import {
  type LucideIcon,
  MessageSquareCode,
  TriangleAlertIcon,
} from "lucide-react";
import Link from "next/link";

interface Props {
  icon: LucideIcon;
  label: string;
  path: string;
  description: string;
}

const data = [
  {
    icon: MessageSquareCode,
    label: "Chat with AI",
    description: "Chat with our chatbot",
    path: "/chatbot",
  },
  {
    icon: TriangleAlertIcon,
    label: "My Reports",
    description: "Manage all of your reports",
    path: "/reports",
  },
];

export function Links() {
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
      {data.map((item) => (
        <LinkCard
          key={item.label}
          icon={item.icon}
          label={item.label}
          path={item.path}
          description={item.description}
        />
      ))}
    </div>
  );
}

function LinkCard({ icon: Icon, label, description, path }: Props) {
  return (
    <Link
      className="w-full p-3 hover:bg-sidebar rounded-none flex flex-col gap-y-2 border"
      href={path}
    >
      <Button
        variant="outline"
        className="bg-green-500 text-white hover:bg-green-600 hover:text-white rounded-none shadow-none border-none"
        size="icon-sm"
      >
        <Icon />
      </Button>
      <div className="flex flex-col">
        <p className="text">{label}</p>
        <p className="font-light text-muted-foreground text-sm">
          {description}
        </p>
      </div>
    </Link>
  );
}
