import { serve } from "inngest/nuxt";
import { inngest } from "../bot/integrations/inngest";
import fnA from "../inngest";

export default defineEventHandler(
  serve({
    client: inngest,
    functions: fnA,
  })
);
