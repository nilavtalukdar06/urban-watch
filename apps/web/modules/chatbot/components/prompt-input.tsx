"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
} from "@workspace/ui/components/input-group";
import { useMutation } from "convex/react";
import { ArrowUpIcon } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";
import { api } from "@workspace/backend/convex/_generated/api";
import { usePrompt } from "../hooks/use-prompt";
import { useState } from "react";
import { toast } from "sonner";
import { Spinner } from "@workspace/ui/components/spinner";

interface Props {
  status: "submitted" | "streaming" | "ready" | "error";
  sendMessage: (message: { text: string }) => void;
}

export function PromptInput({ status, sendMessage }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const mutation = useMutation(api.functions.chatbot.createMessage);
  const { prompt, setPrompt } = usePrompt();

  const handleSubmit = () => {
    try {
      setIsLoading(false);
      mutation({ role: "user", content: prompt });
      sendMessage({ text: prompt });
      setPrompt("");
    } catch (error) {
      console.error(error);
      toast.error("Failed to send prompt");
    } finally {
      setIsLoading(false);
      setPrompt("");
    }
  };
  return (
    <div className="w-full">
      <InputGroup className="bg-white rounded-md shadow-sm border border-neutral-200">
        <TextareaAutosize
          data-slot="input-group-control"
          className="flex field-sizing-content min-h-16 w-full resize-none rounded-2xl bg-transparent px-3 py-2.5 text-base transition-[color,box-shadow] outline-none md:text-sm"
          placeholder="Enter your prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <InputGroupAddon align="block-end">
          <InputGroupButton
            className="rounded-full ml-auto"
            size="icon-sm"
            variant="default"
            onClick={handleSubmit}
            disabled={
              !prompt ||
              isLoading ||
              status === "submitted" ||
              status === "streaming"
            }
          >
            {isLoading ? <Spinner /> : <ArrowUpIcon />}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
