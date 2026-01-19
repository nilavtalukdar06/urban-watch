import { streamText, UIMessage, convertToModelMessages } from "ai";
import { xai } from "@ai-sdk/xai";
import { NextRequest } from "next/server";
import { CHATBOT_PROMPT } from "@/lib/prompts/system";

export async function POST(request: NextRequest) {
  const { messages }: { messages: UIMessage[] } = await request.json();
  const result = streamText({
    model: xai("grok-3-mini"),
    system: CHATBOT_PROMPT,
    messages: await convertToModelMessages(messages),
  });
  return result.toUIMessageStreamResponse();
}
