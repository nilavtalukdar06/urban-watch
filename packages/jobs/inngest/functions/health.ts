import { inngestWeb } from "../client";

export const healthCheck = inngestWeb.createFunction(
  { id: "health-check" },
  { event: "test/health-check" },
  async ({ step }) => {
    await step.run("health-check", () => {
      console.log("inngest is working");
    });
  },
);
