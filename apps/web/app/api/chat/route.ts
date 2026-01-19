import { streamText, UIMessage, convertToModelMessages } from "ai";
import { xai } from "@ai-sdk/xai";
import { NextRequest, NextResponse } from "next/server";
import { CHATBOT_PROMPT } from "@/lib/prompts/system";
import { auth } from "@clerk/nextjs/server";
import { fetchMutation } from "convex/nextjs";
import { api } from "@workspace/backend/convex/_generated/api";

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { error: "the user is not authenticated" },
      { status: 401 },
    );
  }
  const { messages }: { messages: UIMessage[] } = await request.json();
  const result = streamText({
    model: xai("grok-3-mini"),
    system: CHATBOT_PROMPT,
    messages: await convertToModelMessages(messages),
    onFinish: async ({ text }) => {
      await fetchMutation(api.functions.chatbot.createAImessage, {
        role: "assistant",
        content: text,
        userId,
      });
    },
  });
  return result.toUIMessageStreamResponse();
}
