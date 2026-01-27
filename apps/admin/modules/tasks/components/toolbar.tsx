"use client";

import { Button } from "@workspace/ui/components/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { format } from "date-fns";

type Props = {
  date: Date;
  onNavigate: (action: "PREV" | "NEXT" | "TODAY") => void;
};

export function Toolbar({ date, onNavigate }: Props) {
  return (
    <div className="mb-2 w-full flex gap-x-2 justify-start items-center">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onNavigate("PREV")}
        className="shadow-none font-normal bg-sidebar border"
      >
        <ChevronLeftIcon />
        <span>Prev</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onNavigate("NEXT")}
        className="shadow-none font-normal bg-sidebar border"
      >
        <span>Next</span>
        <ChevronRightIcon />
      </Button>
      <div className="ml-auto">
        <p className="text-muted-foreground font-light">
          {format(date, "MMMM, yyyy")}
        </p>
      </div>
    </div>
  );
}
