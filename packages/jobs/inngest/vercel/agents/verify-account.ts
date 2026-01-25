import { openai } from "@ai-sdk/openai";
import { generateText, Output } from "ai";
import { z } from "zod";
import {
  account_verification_prompt,
  userPrompt,
} from "../prompts/verify-account";

interface Account {
  imageUrl: string;
  user: {
    name: string;
    dateOfBirth: string;
    permanentAddress: string;
  };
}

export async function verifyAccount(props: Account) {
  try {
    const result = await generateText({
      model: openai("gpt-5-nano"),
      output: Output.object({
        schema: z.object({
          isAuthorized: z
            .boolean()
            .describe(
              "True if the ID appears legitimate and matches the provided user details",
            ),
          documentType: z
            .string()
            .nullable()
            .describe(
              "Type of identity document if authorized, otherwise null",
            ),
          notes: z
            .string()
            .describe(
              "Brief explanation of verification result or mismatch reason",
            ),
          email: z.object({
            subject: z.string().describe("Email subject to notify the user"),
            body: z
              .string()
              .describe("Email body explaining verification result"),
          }),
        }),
      }),
      messages: [
        {
          role: "system",
          content: account_verification_prompt,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: userPrompt(
                props.user.name,
                props.user.dateOfBirth,
                props.user.permanentAddress,
              ),
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
