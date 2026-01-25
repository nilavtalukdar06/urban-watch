import { openai } from "@ai-sdk/openai";
import { generateText, Output, stepCountIs, tool } from "ai";
import { z } from "zod";
import {
  account_verification_prompt,
  userPrompt,
} from "../prompts/verify-account.js";
import { verificationEmail } from "@workspace/emails/src/verify-account.js";

interface Account {
  imageUrl: string;
  user: {
    email: string;
    name: string;
    dateOfBirth: string;
    permanentAddress: string;
  };
}

export async function verifyAccount(props: Account) {
  const emailTool = tool({
    description:
      "Send the email to the user about their ID verification status",
    inputSchema: z.object({
      subject: z.string().describe("Subject of the email"),
      body: z.string().describe("Body of the email"),
    }),
    strict: true,
    execute: async ({ subject, body }) => {
      const result = await verificationEmail(props.user.email, subject, body);
      return result;
    },
  });
  try {
    const result = await generateText({
      model: openai("gpt-5-nano"),
      stopWhen: stepCountIs(5),
      tools: {
        emailTool,
      },
      output: Output.object({
        schema: z.object({
          isAuthorized: z
            .boolean()
            .describe(
              "True if the ID appears legitimate and matches the provided user details",
            ),
          documentType: z
            .optional(z.string())
            .describe("Type of identity document if authorized"),
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
    return result.content;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
