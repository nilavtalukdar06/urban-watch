"use client";

import { useContext } from "react";
import { PromptContext } from "../context/prompt-provider";

export function usePrompt() {
  const value = useContext(PromptContext);
  if (!value) {
    throw new Error("must be wrapped inside a provider");
  }
  const { prompt, setPrompt } = value;
  return {
    prompt,
    setPrompt,
  };
}
