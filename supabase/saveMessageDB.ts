import supabase from "../bot/integrations/supabase";

export async function saveMessageDB(input) {
  const {
    user,
    messageText,
    rating,
    date,
    draft,
    whatsapp_id,
    is_bot,
    keywords,
    sponsors,
    files = [],
  } = input;
  const { error } = await supabase.from("conversations").insert({
    user: user.id,
    text: messageText,
    rating: rating,
    type: is_bot ? "bot_message" : "message",
    ts: date,
    draft,
    whatsapp_id,
    keywords,
    sponsors,
    files,
  });

  if (error) {
    console.error(`Failed to insert message: ${error.message}`);
  }
}
