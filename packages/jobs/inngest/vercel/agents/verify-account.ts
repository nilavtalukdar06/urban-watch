import { openai } from "@ai-sdk/openai";
import { generateText, Output } from "ai";
import { z } from "zod";

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
            .optional(z.string())
            .describe("Type of identity document if authorized"),
          notes: z
            .string()
            .describe(
              "Brief explanation of verification result or mismatch reason",
            ),
        }),
      }),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "please verify the id",
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
