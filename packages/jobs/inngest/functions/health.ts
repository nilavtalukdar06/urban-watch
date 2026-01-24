import { inngest } from "../client.js";

export const healthCheck = inngest.createFunction(
  { id: "health-check" },
  { event: "test/health-check" },
  async ({ step }) => {
    await step.run("health-check", () => {
      console.log("inngest is working");
    });
  },
);
