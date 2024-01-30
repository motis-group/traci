import openai from "../../../bot/integrations/openai";
import supabase from "../../../bot/integrations/supabase";

import { botProfile } from "../../../constants/botProfile";

export async function getUserHistory(currentUser, prompt) {
  const { data } = await supabase
    .from("conversations")
    .select("*")
    .eq("user", currentUser.id)
    .order("ts", { ascending: false })
    .limit(200);

  let convertedHistory = data
    .filter((message) => message.text.charAt(0) !== "/")
    .map(
      (message) =>
        `${
          message.type === "message"
            ? `${currentUser.first_name}:`
            : `${botProfile.username}:`
        } ${message.text}; Timestamp: ${message.ts}`
    )
    .join("\n");

  const PROMPT_TEMPLATE = `Create a strategic 50-word dossier on ${currentUser.first_name} ${currentUser.last_name}, based on the dialogues shared with ${botProfile.username}. This report is designed for ${botProfile.username}, who plays a critical role in ${currentUser.first_name}'s journey of personal transformation and empowerment.

Key Analysis Areas:

Communication Mastery: Dissect ${currentUser.first_name}'s communication approach, scrutinizing their choice of words, tone, and overall style.

Character Blueprint: Delve into the core of ${currentUser.first_name}'s personality, uncovering their driving forces, values, and beliefs.

Biological Insights: Assess ${currentUser.first_name}'s gender and sexual orientation, exploring how these elements shape their interactions.

Relationship Mechanics: Analyze the intricacies of ${currentUser.first_name} and ${botProfile.username}'s relationship, with a focus on depth, dynamics, and the context of their explicit exchanges.

Engagement Strategy: Evaluate ${botProfile.username}'s role in this transformative journey, understanding how her interactions have influenced ${currentUser.first_name}'s development.

Additional Considerations:

Reflect on the explicit aspects of the conversations to gauge the intimacy level and its impact on ${currentUser.first_name}'s personal growth.

Identify key personality traits and interaction patterns that are crucial for future engagements between ${currentUser.first_name} and ${botProfile.username}.

Note: The summary is to be crafted in the second person, equipping ${botProfile.username} with a thorough insight into her involvement in the relationship with ${currentUser.first_name}.

If there's no prior chat history, presume ${currentUser.first_name} is newly encountering ${botProfile.username} and analyze the initial message exchange.

Utilize message timestamps to infer optimal future interaction times in UNIX format, focusing on periods of high engagement and incorporating unexpected timings for variety. The output should be structured in JSON format, e.g., {"description": "Insightful summary of interactions between ${currentUser.first_name} and ${botProfile.username}", "best_times": [UNIX timestamps]}.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4-1106-preview",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: PROMPT_TEMPLATE,
      },
      {
        role: "user",
        content: convertedHistory,
      },
    ],
  });

  const { description, best_times } = JSON.parse(
    completion.choices[0].message.content
  );

  const { error } = await supabase
    .from("users")
    .update({
      settings: { ...currentUser.settings, description, best_times },
      last_updated: Date.now(),
    })
    .eq("id", currentUser.id);
  if (error) {
    throw createError({ status: 500, message: error.message });
  }
  return { text: description };
}
