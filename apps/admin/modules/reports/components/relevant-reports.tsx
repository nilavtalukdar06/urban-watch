"use client";

import { HoverBorderGradient } from "@workspace/ui/components/ui/hover-border-gradient";
import { Gemini } from "@lobehub/icons";
import { toast } from "sonner";
import { searchRelevantReports } from "../functions/search-relevant-reports";
import { useState } from "react";
import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";
import { X } from "lucide-react";

interface RelevantReportsProps {
  onFiltersApply: (reportIds: string[]) => void;
  onFiltersClear: () => void;
  hasActiveFilters: boolean;
}

export function RelevantReports({
  onFiltersApply,
  onFiltersClear,
  hasActiveFilters,
}: RelevantReportsProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchReports = async () => {
    try {
      setIsLoading(true);
      const result = await searchRelevantReports();
      if (result.length === 0) {
        toast.info("No relevant reports found.");
      } else {
        onFiltersApply(result);
        toast.success(`Found relevant reports!`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch reports");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="my-3 flex flex-col items-start justify-center gap-y-2">
      <HoverBorderGradient
        onClick={isLoading ? undefined : fetchReports}
        containerClassName="rounded-none border-none"
        className={cn(
          "bg-white text-neutral-600 flex items-center justify-center gap-x-2",
        )}
      >
        <Gemini.Color size={18} className={cn(isLoading && "animate-spin")} />
        <span>Search with AI</span>
      </HoverBorderGradient>
      <div>
        {hasActiveFilters && (
          <Button
            onClick={onFiltersClear}
            variant="outline"
            className="rounded-none shadow-none bg-sidebar font-normal"
          >
            <X size={16} className="mr-1" />
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
}
