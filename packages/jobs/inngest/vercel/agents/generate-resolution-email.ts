import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

interface ReportResolutionProps {
  title: string;
  description: string;
  location: string;
}

export async function generateResolutionEmail(props: ReportResolutionProps) {
  try {
    const result = await generateText({
      model: openai("gpt-4o-mini"),
      prompt: `Generate a professional and friendly email body thanking the user for their report about "${props.title}" at "${props.location}". The email should inform them that their report has been reviewed and resolved. The email should be warm, appreciative, and encourage them to continue reporting issues.

Report Details:
- Title: ${props.title}
- Description: ${props.description}
- Location: ${props.location}

Generate only the email body text, no subject line or greeting. Keep it concise and professional.`,
    });

    return {
      subject: `Your Report About "${props.title}" Has Been Reviewed`,
      body: result.text,
    };
  } catch (error) {
    console.error("Error generating resolution email:", error);
    // Fallback email
    return {
      subject: `Your Report About "${props.title}" Has Been Reviewed`,
      body: `Thank you for submitting your report about ${props.title} at ${props.location}. We have reviewed your report and taken the necessary action. We appreciate your contribution to making our community better and encourage you to continue reporting issues.`,
    };
  }
}
