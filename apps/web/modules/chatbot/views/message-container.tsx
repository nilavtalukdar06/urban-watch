import { PromptInput } from "../components/prompt-input";

export function MessageContainer() {
  return (
    <section className="flex-1 flex flex-col h-full p-4">
      <div className="flex flex-col flex-1 min-h-0">
        <p className="text-muted-foreground">Message Container</p>
      </div>
      <div>
        <PromptInput />
      </div>
    </section>
  );
}
