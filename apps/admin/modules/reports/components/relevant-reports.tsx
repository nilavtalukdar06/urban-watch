"use client";

import { HoverBorderGradient } from "@workspace/ui/components/ui/hover-border-gradient";
import { Gemini } from "@lobehub/icons";

export function RelevantReports() {
  return (
    <div className="my-3">
      <HoverBorderGradient
        containerClassName="rounded-none border-none"
        className="bg-white text-neutral-600 flex items-center justify-center gap-x-2"
      >
        <Gemini.Color size={18} />
        <span>Search with AI</span>
      </HoverBorderGradient>
    </div>
  );
}
