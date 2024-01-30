// src/api/slack/events.ts

import { VerifySlackRequest } from "../../integrations/slack/VerifySlackRequest";
import { handleSlackEvent } from "../../integrations/slack/handleSlackEvent";

export default defineEventHandler(async (event) => {
  // Verify the request is coming from Slack
  if (!VerifySlackRequest(event.req)) {
    return { statusCode: 401, body: "Unauthorized" };
  }

  // Handle the Slack event (e.g., a message, a button click)
  try {
    const response = await handleSlackEvent(event.req.body);
    return { statusCode: 200, body: response };
  } catch (error) {
    console.error("Error handling Slack event:", error);
    return { statusCode: 500, body: "Internal Server Error" };
  }
});
