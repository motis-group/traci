// src/integrations/slack/verifySlackRequest.ts

import { createHmac } from "crypto";

// Environment variable for your Slack signing secret
const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;

// Verify Slack request
export function VerifySlackRequest(req: any): boolean {
  const signature = req.headers["x-slack-signature"] as string;
  const timestamp = req.headers["x-slack-request-timestamp"];

  // Protect against replay attacks
  const fiveMinutesAgo = Math.floor(Date.now() / 1000) - 60 * 5;
  if (parseInt(timestamp) < fiveMinutesAgo) return false;

  // Create the HMAC signature
  const [version, hash] = signature.split("=");
  const baseString = `${version}:${timestamp}:${req.rawBody}`;
  const hmac = createHmac("sha256", slackSigningSecret || "");
  hmac.update(baseString);
  const mySignature = `${version}=${hmac.digest("hex")}`;

  // Compare signatures to verify the request
  return timingSafeEqual(Buffer.from(mySignature), Buffer.from(signature));
}

// Helper function to compare HMAC signatures in a way that prevents timing attacks
function timingSafeEqual(a: Buffer, b: Buffer): boolean {
  if (a.length !== b.length) {
    return false;
  }

  const result = a.reduce((acc, val, i) => acc | (val ^ b[i]), 0);
  return result === 0;
}
