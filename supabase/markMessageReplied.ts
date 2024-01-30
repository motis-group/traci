import supabase from "../bot/integrations/supabase";

export async function markMessageReplied(id) {
  const { error } = await supabase
    .from("conversations")
    .update({ draft: false })
    .eq("id", id);

  if (error) {
    console.error(`Failed to update message: ${error.message}`);
  }
}
