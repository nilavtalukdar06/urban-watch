"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
} from "@workspace/ui/components/input-group";
import { ArrowUpIcon } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";

export function PromptInput() {
  return (
    <div className="grid w-full">
      <InputGroup className="bg-white rounded-md shadow-sm border border-neutral-200">
        <TextareaAutosize
          data-slot="input-group-control"
          className="flex field-sizing-content min-h-12 w-full resize-none rounded-2xl bg-transparent px-3 py-2.5 text-base transition-[color,box-shadow] outline-none md:text-sm"
          placeholder="Enter your prompt"
        />
        <InputGroupAddon align="block-end">
          <InputGroupButton
            className="rounded-full ml-auto"
            size="icon-sm"
            variant="default"
          >
            <ArrowUpIcon />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
