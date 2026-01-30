"use client";

import { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { CopyIcon, CheckIcon } from "lucide-react";
import { toast } from "sonner";

export function CopyWebhookUrl() {
  const [isCopied, setIsCopied] = useState(false);
  const webhookUrl = `${process.env.NEXT_PUBLIC_WEBHOOK_URL!}/api/stripe/webhook`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(webhookUrl);
      setIsCopied(true);
      toast.success("Copied webhook url to clipboard");
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy webhook url");
    }
  };

  return (
    <div className="my-2 w-full flex justify-start items-center gap-x-2">
      <Button
        className="pointer-events-none rounded-none font-normal text-neutral-600 bg-sidebar border shadow-none"
        variant="secondary"
      >
        {webhookUrl}
      </Button>
      <Button
        variant="outline"
        className="shadow-none rounded-none"
        onClick={handleCopy}
      >
        {isCopied ? <CheckIcon /> : <CopyIcon />}
      </Button>
    </div>
  );
}
