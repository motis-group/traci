import { reduceTokens } from "../../../bot/afterware/reduceTokens";
import { userFeedbackCache } from "../bot/cache";
import supabase from "../../../bot/integrations/supabase";

export async function saveContentFeedback(currentUser, text) {
  const { error } = await supabase.from("feedback").insert({
    created_by: currentUser.id,
    text,
  });
  if (error) {
    console.error(`Failed to insert feedback: ${error.message}`);
  }
  reduceTokens(currentUser, 50);
  userFeedbackCache.del(currentUser.id);
}
