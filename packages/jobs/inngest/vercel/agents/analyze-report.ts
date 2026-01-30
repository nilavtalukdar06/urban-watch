import { openai } from "@ai-sdk/openai";
import { generateText, Output } from "ai";
import { z } from "zod";
import {
  report_analysis_prompt,
  reportUserPrompt,
} from "../prompts/analyze-report";

interface ReportAnalysis {
  imageUrl: string;
  location: string;
  notes: string;
}

export async function analyzeReport(props: ReportAnalysis) {
  try {
    const result = await generateText({
      model: openai("gpt-4o-mini"),
      output: Output.object({
        schema: z.object({
          isSpam: z
            .boolean()
            .describe(
              "True if the report is spam, false if it is a legitimate urban issue",
            ),
          spamReason: z
            .string()
            .nullable()
            .describe(
              "If spam, brief explanation of why the report was marked as spam",
            ),
          title: z
            .string()
            .nullable()
            .describe("Title of the report if legitimate, otherwise null"),
          description: z
            .string()
            .nullable()
            .describe(
              "Detailed description of the urban issue if legitimate, otherwise null",
            ),
          instructions: z
            .array(z.string())
            .nullable()
            .describe(
              "List of actionable instructions to address the issue if legitimate, otherwise null",
            ),
          whatNotToDo: z
            .array(z.string())
            .nullable()
            .describe(
              "List of things that should NOT be done when addressing this issue if legitimate, otherwise null",
            ),
          priority: z
            .enum(["low", "medium", "high"])
            .nullable()
            .describe(
              "Priority level of the report if legitimate (low, medium, high), otherwise null",
            ),
          inferredGoal: z
            .string()
            .nullable()
            .describe(
              "The inferred goal/objective if legitimate, otherwise null",
            ),
          inferredPurpose: z
            .string()
            .nullable()
            .describe(
              "The inferred purpose/reason for the report if legitimate, otherwise null",
            ),
          email: z.object({
            subject: z.string().describe("Email subject to notify the user"),
            body: z
              .string()
              .describe("Email body explaining spam status or confirmation"),
          }),
        }),
      }),
      messages: [
        {
          role: "system",
          content: report_analysis_prompt,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: reportUserPrompt(props.location, props.notes),
            },
            {
              type: "image",
              image: props.imageUrl,
            },
          ],
        },
      ],
    });
    return result.output;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
