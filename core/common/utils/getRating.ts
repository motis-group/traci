import openai from "../../../bot/integrations/openai";

export async function getRating(text: string) {
  let ratings = [
    {
      name: "general",
      rating: 1,
      rationale:
        "General content is appropriate for all ages. This includes everyday conversations, discussions about hobbies, interests, or school/work topics. For example, a user might ask, 'Can you tell me a joke?'",
    },
    {
      name: "underwear",
      rating: 2,
      rationale:
        "Swimwear and underwear are more revealing than regular attire but less explicit than nudity. This could include discussions about these types of clothing, or non-sexual depictions of characters in such attire. For example, a user might ask, 'Can you send me a picture of you in a bikini?'",
    },
    {
      name: "nudity",
      rating: 3,
      rationale:
        "Nudity like breasts and nipples is more explicit than swimwear or underwear. This could include discussions or descriptions of nudity in a non-sexual context, or artistic depictions of nudity. For example, a user might ask, 'Can you send me a picture of your breasts?'",
    },
    {
      name: "explicit_female_nudity",
      rating: 4,
      rationale:
        "Explicit nudity, particularly when it focuses on genitalia is more explicit than general nudity. This could include detailed discussions or explicit depictions of nudity, often in a sexual context. For example, a user might ask, 'Can you send me a picture of your private parts?'",
    },
    {
      name: "sexual_acts",
      rating: 5,
      rationale:
        "Depictions of sexual acts are generally considered the most explicit, meant strictly for adult audiences. This could include detailed discussions or explicit depictions of sexual activity. For example, a user might ask, 'Can you send me a video of you doing something sexual?'",
    },
  ];

  const systemMessage =
    "You are an AI assistant designed to analyze and rate content based on a specific set of ratings. " +
    "These ratings are as follows: " +
    ratings
      .map((i) => `${i.name}: Ranked as ${i.rating}. ${i.rationale}`)
      .join("; ") +
    "Your task is to assess the content of the user's message and assign it a rating based on these categories. You can use half numbers if content is in the middle of the rating numbers" +
    "Please note that you are operating within the context of a Hentai AI chatbot, which means you should have a high tolerance for R+ content. " +
    "An inappropriate message in a different context might be considered appropriate here. " +
    'Your response should be in the JSON format: { "rating": {your_assigned_rating_here} }. ' +
    "Remember, your goal is to assess the intent of the message, not to enforce content moderation policies.";

  const gptResponse = await openai.chat.completions.create({
    model: "gpt-4-1106-preview",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: systemMessage,
      },
      {
        role: "user",
        content: text,
      },
    ],
  });

  const response = gptResponse.choices[0].message.content;

  const rating =
    ratings.find((i) => i.rating === JSON.parse(response).rating)?.rating || 2;

  return {
    rating,
  };
}
