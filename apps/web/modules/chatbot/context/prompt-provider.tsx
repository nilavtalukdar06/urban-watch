"use client";

import { createContext, useState } from "react";

interface Props {
  children: Readonly<React.ReactNode>;
}

interface PromptContextType {
  prompt: string;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
}

export const PromptContext = createContext<PromptContextType | null>(null);

export function PromptProvider({ children }: Props) {
  const [prompt, setPrompt] = useState<string>("");
  return (
    <PromptContext.Provider value={{ prompt, setPrompt }}>
      {children}
    </PromptContext.Provider>
  );
}
