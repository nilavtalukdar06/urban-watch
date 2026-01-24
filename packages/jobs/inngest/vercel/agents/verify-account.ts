import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

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
