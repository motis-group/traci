import supabase from "../../../bot/integrations/supabase";

export async function getMessageHistory(currentUser) {
  const { data } = await supabase
    .from("conversations")
    .select("type,text,ts")
    .eq("user", currentUser.id)
    .order("ts", { ascending: false })
    .limit(20);

  const {
    data: [botProfile],
  } = await supabase
    .from("bots")
    .select("mood,delays,schedule")
    .eq("id", 1)
    .limit(1);

  const moodMessageTs = botProfile.mood.last_updated;
  let insertIndex = -1;

  const messages = data.reverse().map((message, index) => {
    if (message.ts < moodMessageTs) {
      insertIndex = index;
    }
    return {
      role: message.type === "message" ? "user" : "assistant",
      content: message.text,
    };
  });

  if (insertIndex !== -1) {
    messages.splice(insertIndex, 0, {
      role: "user",
      content: `Your general mood today: ${botProfile.mood.type}, The description of your mood: ${botProfile.mood.description}`,
    });
  }

  return messages;
}
