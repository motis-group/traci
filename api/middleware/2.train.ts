import { getUserHistory } from "../bot/ai/getUserHistory";
import { generateMood } from "../inngest/generateHourlyDelay";
import supabase from "../bot/integrations/supabase";
import bodyFormatter from "../bot/formatters/bodyFormatter";

export default defineEventHandler(async (event) => {
  try {
    let body = bodyFormatter(await readBody(event)); // Combined two lines into one

    if (body.is_outbound) return;
    if (
      body.messaging_product === "supabase" ||
      body.messaging_product === "stripe"
    ) {
      return;
    }

    const { user } = event.context;

    // Extracted repeated code into a function
    const updateUser = async (updates) => {
      const { error } = await supabase
        .from("users")
        .update(updates)
        .eq("id", user.id);
      if (error) {
        throw createError({ status: 500, message: error.message });
      }
      Object.assign(user, updates);
    };

    if (user.onboarding && user.conversations > 4) {
      await updateUser({ onboarding: false });
    }

    // const { last_updated, ends } = user.settings.mood;
    // const now = Date.now();
    // if (
    //   !last_updated ||
    //   last_updated + ends < now ||
    //   last_updated < now - 86400000
    // ) {
    //   await generateOverallMood(user);
    //   const {
    //     data: [{ settings }],
    //     error: userError,
    //   } = await supabase
    //     .from("users")
    //     .select("settings")
    //     .eq("id", user.id)
    //     .limit(1);
    //   if (userError) {
    //     throw createError({ status: 500, message: userError.message });
    //   }
    //   user.settings = settings;
    // }

    if (user.last_updated === null || user.conversations % 50 === 0) {
      console.log("Updating user dossier...");
      getUserHistory(user, null);
    }
  } catch (error) {
    console.error(`Error in event handler: ${error}`);
  }
});
